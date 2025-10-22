from rest_framework import serializers

from .models import Driver, DriverApplication, DriverApplicationMotorPhoto


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


class DriverApplicationMotorPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverApplicationMotorPhoto
        fields = [
            "id",
            "photo",
            "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_at"]


class DriverApplicationSerializer(serializers.ModelSerializer):
    motor_photos = DriverApplicationMotorPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = DriverApplication
        fields = [
            "id",
            "reference_number",
            "first_name",
            "last_name",
            "name",
            "email",
            "phone",
            "address",
            "city",
            "province",
            "zip_code",
            "applied_at",
            "vehicle_type",
            "vehicle_model",
            "vehicle_color",
            "license_plate",
            "license_number",
            "or_number",
            "cr_number",
            "service_types",
            "license_file",
            "orcr_file",
            "nbi_file",
            "status",
            "motor_photos",
        ]
        read_only_fields = [
            "id",
            "reference_number",
            "applied_at",
            "status",
            "motor_photos",
        ]


class DriverApplicationCreateSerializer(serializers.ModelSerializer):
    motor_photos = serializers.ListField(
        child=serializers.FileField(max_length=None, allow_empty_file=False, use_url=False),
        required=False,
        write_only=True,
    )
    service_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )

    class Meta:
        model = DriverApplication
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
            "city",
            "province",
            "zip_code",
            "vehicle_type",
            "vehicle_model",
            "vehicle_color",
            "license_plate",
            "license_number",
            "or_number",
            "cr_number",
            "service_types",
            "license_file",
            "orcr_file",
            "nbi_file",
            "motor_photos",
        ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "phone": {"required": True},
        }

    def validate_service_types(self, value):
        return [item for item in value if item]

    def create(self, validated_data):
        motor_photos = validated_data.pop("motor_photos", [])
        service_types = validated_data.get("service_types") or []

        if not validated_data.get("vehicle_type"):
            validated_data["vehicle_type"] = "motorcycle"

        validated_data["service_types"] = service_types

        application = DriverApplication.objects.create(**validated_data)

        for photo in motor_photos:
            DriverApplicationMotorPhoto.objects.create(application=application, photo=photo)

        return application
