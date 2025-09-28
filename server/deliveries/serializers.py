from rest_framework import serializers

from deliveries.models import Delivery


class DeliverySerializer(serializers.ModelSerializer):
    driver = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = [
            "id",
            "sender",
            "receiver",
            "driver",
            "package",
            "pickup",
            "destination",
            "status",
            "fee",
            "time",
            "proof_photo",
            "proof_signature",
        ]

    def get_driver(self, obj: Delivery) -> str:
        try:
            return obj.driver.name if obj.driver else "Unassigned"
        except Exception:
            return "Unassigned"


