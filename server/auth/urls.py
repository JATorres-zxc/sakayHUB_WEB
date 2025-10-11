from django.urls import path

from .views import (
    DriverLoginView,
    DriverMeView,
    UserLoginView,
    UserLogoutView,
    UserMeView,
    UserSignupView,
    UserVerifyView,
)

urlpatterns = [
    path("users/signup/", UserSignupView.as_view(), name="user-signup"),
    path("users/verify/", UserVerifyView.as_view(), name="user-verify"),
    path("users/login/", UserLoginView.as_view(), name="user-login"),
    path("users/logout/", UserLogoutView.as_view(), name="user-logout"),
    path("users/me/", UserMeView.as_view(), name="user-me"),
    path("drivers/login/", DriverLoginView.as_view(), name="driver-login"),
    path("drivers/me/", DriverMeView.as_view(), name="driver-me"),
]
