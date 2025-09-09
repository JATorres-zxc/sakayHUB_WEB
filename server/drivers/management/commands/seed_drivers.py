import random
from datetime import datetime, timedelta, date

from django.core.management.base import BaseCommand

from drivers.models import Driver


FIRST_NAMES = [
    "David", "Maria", "James", "Lisa", "Robert", "John", "Sarah", "Emma", "Alex", "Olivia",
    "Liam", "Sophia",
]
LAST_NAMES = [
    "Rodriguez", "Garcia", "Wilson", "Thompson", "Chen", "Taylor", "Anderson", "Thomas", "Jackson", "White",
]
DOMAINS = ["example.com", "mail.com", "rides.io", "sample.org"]
PHONE_PREFIXES = ["+1 234", "+44 20", "+63 917", "+61 2", "+81 3"]
STATUS_CHOICES = ["active", "suspended", "pending"]
LICENSE_CHOICES = ["verified", "pending", "processing", "rejected"]
VEHICLE_CHOICES = ["sedan", "suv", "motorcycle", "van"]


class Command(BaseCommand):
    help = "Seed randomized drivers for testing"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=12, help="Number of drivers to create")
        parser.add_argument("--clear", action="store_true", help="Clear existing drivers before seeding")

    def handle(self, *args, **options):
        count: int = options["count"]
        clear: bool = options["clear"]

        if clear:
            deleted, _ = Driver.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted} existing drivers."))

        created = 0
        attempts = 0
        while created < count and attempts < count * 5:
            attempts += 1
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            name = f"{first} {last}"
            email = f"{first.lower()}.{last.lower()}{random.randint(1,9999)}@{random.choice(DOMAINS)}"
            phone = f"{random.choice(PHONE_PREFIXES)} {random.randint(100,999)} {random.randint(100,999)} {random.randint(1000,9999)}"
            status = random.choice(STATUS_CHOICES)
            vehicle_type = random.choice(VEHICLE_CHOICES)
            license_status = random.choice(LICENSE_CHOICES)
            rating = round(random.uniform(0, 5), 1)
            total_rides = random.randint(0, 1000)
            earnings = round(random.uniform(0, 20000), 2)
            online = random.choice([True, False])

            days_ago = random.randint(0, 365)
            join_date = date.today() - timedelta(days=days_ago)

            minutes_ago = random.randint(0, 60 * 24 * 30)
            last_active = datetime.utcnow() - timedelta(minutes=minutes_ago)

            try:
                Driver.objects.create(
                    name=name,
                    email=email,
                    phone=phone,
                    status=status,
                    vehicle_type=vehicle_type,
                    license_status=license_status,
                    rating=rating,
                    total_rides=total_rides,
                    earnings=earnings,
                    online=online,
                    join_date=join_date,
                    last_active=last_active,
                )
                created += 1
            except Exception:
                continue

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} drivers."))


