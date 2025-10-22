from django.contrib import admin

from .models import Driver, DriverApplication


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "status",
        "vehicle_type",
        "total_rides",
        "total_sakays",
        "number_of_cancellations",
        "earnings",
    )
    list_filter = (
        "status",
        "vehicle_type",
        "license_status",
        "online",
    )
    search_fields = ("name", "phone", "email", "plate_number", "license_number")
    readonly_fields = ("join_date", "last_active")


@admin.register(DriverApplication)
class DriverApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "vehicle_type", "status", "applied_at")
    list_filter = ("vehicle_type", "status")
    search_fields = ("name", "phone", "email", "license_number")
