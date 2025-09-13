from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_POST, require_GET
from django.core.cache import cache
from django.middleware.csrf import rotate_token, get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as drf_status

from .models import User
from .serializers import UserSerializer, UserStatusUpdateSerializer
from .pagination import UserPagination
from django.db.models import Q


MAX_FAILED_LOGINS = 5
BLOCK_MINUTES = 15


def _get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR") or "unknown"


@ensure_csrf_cookie
@require_GET
def csrf(request):
    # Also return the token in JSON for clients that avoid reading cookies
    return JsonResponse({"detail": "CSRF cookie set", "csrftoken": get_token(request)})


@csrf_protect
@require_POST
def login(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    # Rate limiting per IP+username
    ip = _get_client_ip(request)
    cache_key = f"login_fail:{ip}:{username}"
    failures = cache.get(cache_key, 0)
    if failures >= MAX_FAILED_LOGINS:
        return JsonResponse({"detail": "Too many attempts. Try again later."}, status=429)

    user = authenticate(request, username=username, password=password)
    if user is None:
        cache.set(cache_key, failures + 1, BLOCK_MINUTES * 60)
        return JsonResponse({"detail": "Invalid credentials"}, status=401)

    if not user.is_active:
        cache.set(cache_key, failures + 1, BLOCK_MINUTES * 60)
        return JsonResponse({"detail": "Invalid credentials"}, status=401)

    # Restrict to staff/admin accounts for CRM
    if not (user.is_staff or user.is_superuser):
        return JsonResponse({"detail": "Unauthorized"}, status=403)

    # Successful auth: clear failure counter and rotate CSRF token
    cache.delete(cache_key)
    django_login(request, user)
    rotate_token(request)
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "email": user.email,
    })


@require_POST
def logout(request):
    django_logout(request)
    rotate_token(request)
    return JsonResponse({"detail": "Logged out"})


@require_GET
def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False}, status=200)

    user = request.user
    return JsonResponse({
        "isAuthenticated": True,
        "id": user.id,
        "username": user.username,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "email": user.email,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_users(request):
    # CRM users are separate from auth users; list business users from our User model
    queryset = User.objects.all().order_by("id")
    # Server-side search across the full dataset then paginate
    search = request.GET.get("search", "").strip()
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search)
            | Q(email__icontains=search)
            | Q(phone__icontains=search)
        )
    paginator = UserPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = UserSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_status(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=drf_status.HTTP_404_NOT_FOUND)

    serializer = UserStatusUpdateSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # Return the full user payload for frontend convenience
        return Response(UserSerializer(user).data, status=drf_status.HTTP_200_OK)
    return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def suspend_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=drf_status.HTTP_404_NOT_FOUND)

    user.status = "suspended"
    user.save(update_fields=["status"])
    return Response(UserSerializer(user).data, status=drf_status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unsuspend_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=drf_status.HTTP_404_NOT_FOUND)

    user.status = "active"
    user.save(update_fields=["status"])
    return Response(UserSerializer(user).data, status=drf_status.HTTP_200_OK)
