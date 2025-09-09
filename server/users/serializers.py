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


