import random
from datetime import datetime, timedelta, date

from django.core.management.base import BaseCommand

from users.models import User


FIRST_NAMES = [
    "John", "Sarah", "Mike", "Emma", "Alex", "Olivia", "Liam", "Sophia", "Noah", "Ava",
]
LAST_NAMES = [
    "Doe", "Wilson", "Johnson", "Davis", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White",
]
DOMAINS = ["example.com", "mail.com", "test.io", "sample.org"]
PHONE_PREFIXES = ["+1 234", "+44 20", "+63 917", "+61 2", "+81 3"]
STATUS_CHOICES = ["active", "suspended", "inactive"]
KYC_CHOICES = ["verified", "pending", "rejected"]


class Command(BaseCommand):
    help = "Seed 10 random users into the users_user table"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=10, help="Number of users to create")
        parser.add_argument("--clear", action="store_true", help="Clear existing users before seeding")

    def handle(self, *args, **options):
        count: int = options["count"]
        clear: bool = options["clear"]

        if clear:
            deleted, _ = User.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted} existing users."))

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
            kyc_status = random.choice(KYC_CHOICES)
            total_rides = random.randint(0, 250)
            total_spent = round(random.uniform(10, 5000), 2)

            days_ago = random.randint(0, 365)
            join_date = date.today() - timedelta(days=days_ago)

            minutes_ago = random.randint(0, 60 * 24 * 30)
            last_active = datetime.utcnow() - timedelta(minutes=minutes_ago)

            try:
                User.objects.create(
                    name=name,
                    email=email,
                    phone=phone,
                    status=status,
                    kyc_status=kyc_status,
                    total_rides=total_rides,
                    total_spent=total_spent,
                    join_date=join_date,
                    last_active=last_active,
                )
                created += 1
            except Exception as exc:
                # Skip duplicates or validation errors and continue
                continue

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} users."))


