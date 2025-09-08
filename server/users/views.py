from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_POST, require_GET


@ensure_csrf_cookie
@require_GET
def csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})


@csrf_protect
@require_POST
def login(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Username and password are required"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Invalid credentials"}, status=401)

    if not user.is_active:
        return JsonResponse({"detail": "User inactive"}, status=403)

    django_login(request, user)
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
