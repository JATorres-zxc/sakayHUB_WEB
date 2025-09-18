from rest_framework import serializers

from rides.models import Ride


class RideSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()
    driver = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = [
            "id",
            "customer",
            "driver",
            "pickup",
            "destination",
            "status",
            "fare",
            "time",
        ]

    def get_customer(self, obj: Ride) -> str:
        try:
            return obj.customer.name
        except Exception:
            return "Unknown"

    def get_driver(self, obj: Ride) -> str:
        try:
            return obj.driver.name if obj.driver else "Unassigned"
        except Exception:
            return "Unassigned"


