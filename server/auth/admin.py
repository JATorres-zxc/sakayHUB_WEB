from django.contrib import admin

from .models import MobileProfile, PhoneVerification


@admin.register(MobileProfile)
class MobileProfileAdmin(admin.ModelAdmin):
    list_display = ("phone", "role", "name", "is_phone_verified", "created_at")
    list_filter = ("role", "is_phone_verified")
    search_fields = ("phone", "name", "user__email")


@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ("phone", "role", "code", "expires_at", "attempts")
    list_filter = ("role",)
    search_fields = ("phone",)
    readonly_fields = ("created_at",)
