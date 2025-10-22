import json

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from .models import DriverApplication


class DriverApplicationSubmissionTests(APITestCase):
    def setUp(self):
        self.public_client = APIClient()
        self.auth_client = APIClient()
        User = get_user_model()
        self.admin_user = User.objects.create_user(
            username="admin@example.com",
            email="admin@example.com",
            password="adminpass123",
            is_staff=True,
        )
        self.auth_client.force_authenticate(user=self.admin_user)

    def test_submit_application_and_list_in_admin_endpoint(self):
        for index in range(15):
            DriverApplication.objects.create(
                first_name=f"Seed{index}",
                last_name="Applicant",
                email=f"seed{index}@example.com",
                phone=f"+63 900 000 00{index:02d}",
                vehicle_type="motorcycle",
                status="pending",
            )

        license_file = SimpleUploadedFile("license.jpg", b"license image bytes", content_type="image/jpeg")
        orcr_file = SimpleUploadedFile("orcr.pdf", b"%PDF-1.4 fake pdf bytes", content_type="application/pdf")
        motor_photo = SimpleUploadedFile("motorbike.jpg", b"motor photo bytes", content_type="image/jpeg")

        payload = {
            "first_name": "Juan",
            "last_name": "Dela Cruz",
            "phone_number": "+63 912 345 6789",
            "email": "juan.delacruz@example.com",
            "address": "123 Sample Street",
            "city": "Quezon City",
            "province": "Metro Manila",
            "zip_code": "1100",
            "vehicle_type": "motorcycle",
            "vehicle_model": "Honda Click 150i",
            "vehicle_color": "Red",
            "license_plate": "ABC1234",
            "license_number": "DL123456789",
            "or_number": "OR-1234567",
            "cr_number": "CR-9876543",
            "serviceTypes": json.dumps(["ride_hailing", "food_delivery"]),
            "license_file": license_file,
            "orcr_file": orcr_file,
            "motor_photo_0": motor_photo,
        }

        response = self.public_client.post("/api/driver-applications/", data=payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

        response_data = response.json()
        self.assertIn("reference_number", response_data)
        reference_number = response_data["reference_number"]
        application = DriverApplication.objects.get(reference_number=reference_number)

        self.assertEqual(application.first_name, "Juan")
        self.assertEqual(application.last_name, "Dela Cruz")
        self.assertEqual(application.phone, "+63 912 345 6789")
        self.assertListEqual(application.service_types, ["ride_hailing", "food_delivery"])
        self.assertTrue(application.motor_photos.exists())
        self.assertEqual(DriverApplication.objects.count(), 16)

        list_response = self.auth_client.get("/api/drivers/applications/?page_size=50")
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        results = list_response.json().get("results", [])
        self.assertEqual(list_response.json().get("count"), 16)
        self.assertTrue(any(app["reference_number"] == reference_number for app in results))
