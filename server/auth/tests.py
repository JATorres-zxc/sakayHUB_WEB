import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sakayhub_admin.settings")

CURRENT_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import django

django.setup()

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

try:
    from .models import MobileProfile, PhoneVerification
except ImportError:  # pragma: no cover - fallback when executed as script
    from auth.models import MobileProfile, PhoneVerification


class AuthAPITestCase(APITestCase):
    def _create_mobile_account(self, *, phone: str, password: str, role: str, name: str = "Test User"):
        """Helper to seed a phone/password pair backed by a mobile profile."""
        UserModel = get_user_model()
        sanitized_phone = phone.replace("+", "").replace(" ", "")
        user = UserModel.objects.create_user(
            username=phone,
            email=f"{sanitized_phone}@example.com",
            password=password,
        )
        user.first_name = name
        user.save(update_fields=["first_name"])

        profile = MobileProfile.objects.create(
            user=user,
            role=role,
            name=name,
            phone=phone,
            is_phone_verified=True,
        )
        return profile

    def test_user_signup_and_verification_creates_mobile_profile(self):
        signup_payload = {
            "name": "Jane Rider",
            "email": "jane.rider@example.com",
            "phone": "+63 917 000 0001",
            "password": "secretpass123",
            "date_of_birth": "1995-05-05",
            "favorite_locations": ["Home", "Office"],
        }

        signup_response = self.client.post(
            reverse("user-signup"),
            signup_payload,
            format="json",
        )
        self.assertEqual(signup_response.status_code, 201)
        self.assertIn("verification_code", signup_response.data)

        code = signup_response.data["verification_code"]
        verify_response = self.client.post(
            reverse("user-verify"),
            {
                "phone": signup_payload["phone"],
                "code": code,
            },
            format="json",
        )
        self.assertEqual(verify_response.status_code, 201)

        UserModel = get_user_model()
        user = UserModel.objects.get(username=signup_payload["phone"])
        profile = user.mobile_profile

        self.assertTrue(profile.is_phone_verified)
        self.assertEqual(profile.name, signup_payload["name"])
        self.assertEqual(profile.phone, signup_payload["phone"])
        self.assertEqual(profile.role, MobileProfile.ROLE_USER)
        self.assertFalse(
            PhoneVerification.objects.filter(phone=signup_payload["phone"]).exists()
        )

    def test_user_login_returns_token(self):
        phone = "+63 917 000 0002"
        password = "strongpass456"
        profile = self._create_mobile_account(
            phone=phone,
            password=password,
            role=MobileProfile.ROLE_USER,
            name="John Rider",
        )

        login_response = self.client.post(
            reverse("user-login"),
            {"phone": phone, "password": password},
            format="json",
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertIn("token", login_response.data)
        self.assertIn("user", login_response.data)
        self.assertEqual(login_response.data["user"]["phone"], phone)
        self.assertEqual(login_response.data["user"]["role"], MobileProfile.ROLE_USER)
        self.assertTrue(Token.objects.filter(user=profile.user).exists())

    def test_driver_login_returns_token(self):
        phone = "+63 917 000 0003"
        password = "driverpass789"
        profile = self._create_mobile_account(
            phone=phone,
            password=password,
            role=MobileProfile.ROLE_DRIVER,
            name="Driver Dan",
        )

        login_response = self.client.post(
            reverse("driver-login"),
            {"phone": phone, "password": password},
            format="json",
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertIn("token", login_response.data)
        self.assertIn("driver", login_response.data)
        self.assertEqual(login_response.data["driver"]["phone"], phone)
        self.assertEqual(login_response.data["driver"]["role"], MobileProfile.ROLE_DRIVER)
        self.assertTrue(Token.objects.filter(user=profile.user).exists())


if __name__ == "__main__":
    from django.conf import settings
    from django.test.utils import get_runner

    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(["auth"])
    sys.exit(bool(failures))
