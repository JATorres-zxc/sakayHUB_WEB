from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "status",
            "kyc_status",
            "total_rides",
            "total_spent",
            "join_date",
            "last_active",
        ]

    def validate_total_spent(self, value):
        """Validate that total_spent is not negative."""
        if value < 0:
            raise serializers.ValidationError("Total spent cannot be negative.")
        return value


class UserStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "status",
        ]
        extra_kwargs = {
            "status": {"required": True},
        }

    def validate_status(self, value):
        valid_values = [choice[0] for choice in User.STATUS_CHOICES]
        if value not in valid_values:
            raise serializers.ValidationError("Invalid status value.")
        return value

