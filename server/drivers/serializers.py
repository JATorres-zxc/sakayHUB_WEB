from rest_framework import serializers

from .models import Driver, DriverApplication


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
            "total_sakays",
            "number_of_cancellations",
            "earnings",
            "online",
            "feedback",
            "license_number",
            "license_expiry",
            "license_photo",
            "vehicle_model",
            "vehicle_color",
            "plate_number",
            "profile_photo",
            "date_of_birth",
            "join_date",
            "last_active",
        ]


class DriverStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = [
            "status",
        ]
        extra_kwargs = {
            "status": {"required": True},
        }

    def validate_status(self, value):
        valid_values = [choice[0] for choice in Driver.STATUS_CHOICES]
        if value not in valid_values:
            raise serializers.ValidationError("Invalid status value.")
        return value


class DriverApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverApplication
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "applied_at",
            "vehicle_type",
            "license_number",
            "status",
        ]

    def validate_earnings(self, value):
        """Validate that earnings is not negative."""
        if value < 0:
            raise serializers.ValidationError("Earnings cannot be negative.")
        return value


