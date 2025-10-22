import random

from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MobileProfile, PhoneVerification
from .serializers import (
    LoginSerializer,
    MobileProfileSerializer,
    UserSignupSerializer,
    VerificationSerializer,
)

VERIFICATION_TTL_MINUTES = 10
MAX_VERIFICATION_ATTEMPTS = 5


def _generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"


class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prepared = serializer.create_verification_payload()

        code = _generate_otp()
        expires_at = timezone.now() + timezone.timedelta(minutes=VERIFICATION_TTL_MINUTES)
        PhoneVerification.objects.update_or_create(
            phone=prepared["phone"],
            role=MobileProfile.ROLE_USER,
            defaults={
                "code": code,
                "hashed_password": prepared["hashed_password"],
                "payload": prepared["payload"],
                "expires_at": expires_at,
                "attempts": 0,
            },
        )

        # NOTE: For now return the code so QA can complete verification without SMS.
        # Replace with SMS integration in production.
        return Response(
            {
                "detail": "Verification code sent.",
                "verification_code": code,
                "expires_in_minutes": VERIFICATION_TTL_MINUTES,
            },
            status=status.HTTP_201_CREATED,
        )


class UserVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        code = serializer.validated_data["code"]

        try:
            verification = PhoneVerification.objects.get(
                phone=phone, role=MobileProfile.ROLE_USER
            )
        except PhoneVerification.DoesNotExist:
            return Response(
                {"detail": "No pending verification for this phone number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.is_expired:
            verification.delete()
            return Response(
                {"detail": "Verification code expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.code != code:
            verification.attempts += 1
            if verification.attempts >= MAX_VERIFICATION_ATTEMPTS:
                verification.delete()
                return Response(
                    {"detail": "Too many incorrect attempts. Start over."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            verification.save(update_fields=["attempts"])
            remaining = MAX_VERIFICATION_ATTEMPTS - verification.attempts
            return Response(
                {
                    "detail": "Incorrect verification code.",
                    "attempts_remaining": remaining,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = verification.payload or {}
        UserModel = get_user_model()

        if UserModel.objects.filter(username=phone).exists():
            verification.delete()
            return Response(
                {"detail": "Account already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            try:
                user = UserModel.objects.create(
                    username=phone, email=payload.get("email", "")
                )
            except IntegrityError:
                verification.delete()
                return Response(
                    {"detail": "Unable to create account with provided details."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.first_name = payload.get("name", "")[:150]
            user.password = verification.hashed_password
            user.save(update_fields=["first_name", "password"])

            profile = MobileProfile.objects.create(
                user=user,
                role=MobileProfile.ROLE_USER,
                name=payload.get("name", ""),
                phone=phone,
                is_phone_verified=True,
            )

            verification.delete()

        response_payload = MobileProfileSerializer(profile).data
        return Response(response_payload, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=phone, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid phone number or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            profile = user.mobile_profile
        except MobileProfile.DoesNotExist:
            return Response(
                {"detail": "Mobile account not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.role != MobileProfile.ROLE_USER:
            return Response(
                {"detail": "Please use the driver app to sign in."},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": MobileProfileSerializer(profile).data},
            status=status.HTTP_200_OK,
        )


class UserLogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        if isinstance(token, Token):
            token.delete()
        else:
            Token.objects.filter(user=request.user).delete()
        return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)


class UserMeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.mobile_profile
        except MobileProfile.DoesNotExist:
            return Response(
                {"detail": "Mobile profile missing."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if profile.role != MobileProfile.ROLE_USER:
            return Response(
                {"detail": "Driver token cannot access rider info."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(MobileProfileSerializer(profile).data, status=status.HTTP_200_OK)


class DriverLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=phone, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid phone number or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            profile = user.mobile_profile
        except MobileProfile.DoesNotExist:
            return Response(
                {"detail": "Driver account not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.role != MobileProfile.ROLE_DRIVER:
            return Response(
                {"detail": "Please use the rider app to sign in."},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "driver": MobileProfileSerializer(profile).data},
            status=status.HTTP_200_OK,
        )


class DriverMeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.mobile_profile
        except MobileProfile.DoesNotExist:
            return Response(
                {"detail": "Mobile profile missing."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if profile.role != MobileProfile.ROLE_DRIVER:
            return Response(
                {"detail": "Rider token cannot access driver info."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(MobileProfileSerializer(profile).data, status=status.HTTP_200_OK)
