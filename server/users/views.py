from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_POST, require_GET
from django.core.cache import cache
from django.middleware.csrf import rotate_token, get_token


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
