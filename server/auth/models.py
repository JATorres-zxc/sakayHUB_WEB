from django.conf import settings
from django.db import models
from django.utils import timezone


class MobileProfile(models.Model):
    """Profile that stores mobile auth specific data for both riders and drivers."""

    ROLE_USER = "user"
    ROLE_DRIVER = "driver"
    ROLE_CHOICES = [
        (ROLE_USER, "User"),
        (ROLE_DRIVER, "Driver"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mobile_profile",
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["phone"]),
        ]

    def __str__(self) -> str:
        return f"{self.get_role_display()}:{self.phone}"


class PhoneVerification(models.Model):
    """Temporary store for pending signups waiting for OTP verification."""

    ROLE_CHOICES = MobileProfile.ROLE_CHOICES

    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    code = models.CharField(max_length=6)
    hashed_password = models.CharField(max_length=128)
    payload = models.JSONField(default=dict)
    attempts = models.PositiveSmallIntegerField(default=0)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("phone", "role")

    def __str__(self) -> str:
        return f"OTP {self.phone} ({self.role})"

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at
