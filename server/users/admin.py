from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "email",
        "status",
        "kyc_status",
        "total_rides",
        "total_spent",
    )
    list_filter = ("status", "kyc_status")
    search_fields = ("name", "phone", "email")
    readonly_fields = ("join_date", "last_active")
