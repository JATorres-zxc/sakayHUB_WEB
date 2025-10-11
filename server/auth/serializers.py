from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import MobileProfile, PhoneVerification

class UserSignupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, min_length=8)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    favorite_locations = serializers.ListField(
        child=serializers.CharField(max_length=255),
        required=False,
        allow_empty=True,
    )

    def validate_phone(self, value: str) -> str:
        if MobileProfile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already registered.")
        return value

    def validate_email(self, value: str) -> str:
        UserModel = get_user_model()
        if UserModel.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value

    def create_verification_payload(self) -> dict:
        validated = self.validated_data
        hashed_password = make_password(validated["password"])
        date_of_birth = validated.get("date_of_birth")
        favorite_locations = validated.get("favorite_locations", [])
        if favorite_locations in (None, ""):
            favorite_locations = []
        payload_dob = date_of_birth.isoformat() if date_of_birth else None
        payload = {
            "name": validated["name"],
            "email": validated["email"],
            "date_of_birth": payload_dob,
            "favorite_locations": favorite_locations,
        }
        return {
            "phone": validated["phone"],
            "hashed_password": hashed_password,
            "payload": payload,
        }


class VerificationSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)


class MobileProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = MobileProfile
        fields = [
            "name",
            "phone",
            "email",
            "role",
            "is_phone_verified",
            "created_at",
        ]
