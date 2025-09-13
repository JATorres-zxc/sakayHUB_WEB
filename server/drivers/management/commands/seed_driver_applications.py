import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from drivers.models import DriverApplication


FIRST_NAMES = [
    "Carlos", "Anna", "Michael", "Sophie", "Liam", "Emma", "Noah", "Olivia",
    "Ethan", "Ava", "Mia", "Isabella", "Lucas", "Amelia",
]
LAST_NAMES = [
    "Martinez", "Kim", "Brown", "Chen", "Garcia", "Rodriguez", "Williams", "Johnson",
]
DOMAINS = ["example.com", "mail.com", "rides.io", "sample.org"]
PHONE_PREFIXES = ["+1 234", "+44 20", "+63 917", "+61 2", "+81 3"]
STATUS_CHOICES = ["pending", "under_review", "approved", "rejected"]
VEHICLE_CHOICES = ["sedan", "suv", "motorcycle", "van"]


class Command(BaseCommand):
    help = "Seed randomized driver applications"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=14, help="Number of applications to create")
        parser.add_argument("--clear", action="store_true", help="Clear existing applications before seeding")

    def handle(self, *args, **options):
        count: int = options["count"]
        clear: bool = options["clear"]

        if clear:
            deleted, _ = DriverApplication.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted} existing applications."))

        created = 0
        attempts = 0
        while created < count and attempts < count * 5:
            attempts += 1
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            name = f"{first} {last}"
            email = f"{first.lower()}.{last.lower()}{random.randint(1,9999)}@{random.choice(DOMAINS)}"
            phone = f"{random.choice(PHONE_PREFIXES)} {random.randint(100,999)} {random.randint(100,999)} {random.randint(1000,9999)}"

            applied_minutes_ago = random.randint(10, 60 * 24 * 14)
            applied_at = timezone.now() - timedelta(minutes=applied_minutes_ago)  # ✅ timezone-aware datetime

            vehicle_type = random.choice(VEHICLE_CHOICES)
            license_number = f"DL{random.randint(100000000, 999999999)}"
            status = random.choice(STATUS_CHOICES)

            try:
                DriverApplication.objects.create(
                    name=name,
                    email=email,
                    phone=phone,
                    applied_at=applied_at,
                    vehicle_type=vehicle_type,
                    license_number=license_number,
                    status=status,
                )
                created += 1
            except Exception:
                continue

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} driver applications."))
