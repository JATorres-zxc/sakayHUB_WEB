from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "status",
            "vehicle_type",
            "license_status",
            "rating",
            "total_rides",
            "earnings",
            "online",
            "join_date",
            "last_active",
        ]

    def validate_earnings(self, value):
        """Validate that earnings is not negative."""
        if value < 0:
            raise serializers.ValidationError("Earnings cannot be negative.")
        return value


