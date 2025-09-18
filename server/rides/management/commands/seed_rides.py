import random
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from rides.models import Ride
from users.models import User
from drivers.models import Driver


PICKUPS = [
    "Downtown Station",
    "City Mall",
    "University Gate",
    "Tech Park",
    "Central Market",
    "Airport Terminal",
    "Harbor Point",
    "North Avenue",
]

DESTINATIONS = [
    "Financial District",
    "West End",
    "East Village",
    "South Pier",
    "Old Town",
    "Science Museum",
    "Convention Center",
    "City Park",
]


class Command(BaseCommand):
    help = "Seed recent rides (default 16) for operations dashboard testing"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=16, help="Number of rides to create")
        parser.add_argument("--clear", action="store_true", help="Clear ALL rides before seeding")
        parser.add_argument("--delete-first", type=int, default=0, help="Delete the first N rides before seeding")

    def handle(self, *args, **options):
        count: int = options["count"]
        clear: bool = options["clear"]
        delete_first: int = options["delete_first"]

        if clear:
            deleted, _ = Ride.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted} existing rides."))

        elif delete_first > 0:
            qs = Ride.objects.all().order_by("id")[:delete_first]
            deleted_count = qs.count()
            qs.delete()
            self.stdout.write(self.style.WARNING(f"Deleted the first {deleted_count} rides."))

        users = list(User.objects.all()[:100])
        drivers = list(Driver.objects.all()[:100])

        if not users or not drivers:
            self.stdout.write(self.style.ERROR("Requires at least 1 user and 1 driver. Seed those first."))
            return

        created = 0
        for i in range(count):
            customer = random.choice(users)
            driver = random.choice(drivers)
            pickup = random.choice(PICKUPS)
            destination = random.choice(DESTINATIONS)

            # Recent rides: within last 14 days, random time of day
            days_ago = random.randint(0, 14)
            minutes_offset = random.randint(0, 60 * 24)
            naive_time = datetime.utcnow() - timedelta(days=days_ago, minutes=minutes_offset)
            time = timezone.make_aware(naive_time)  # ✅ timezone-aware

            # Status distribution: mostly completed, some ongoing, few cancelled
            status = random.choices(
                population=["completed", "ongoing", "cancelled"],
                weights=[65, 25, 10],
                k=1,
            )[0]

            # Fare roughly proportional to distance
            base = random.uniform(3, 8)
            distance_factor = random.uniform(1.0, 6.0)
            fare = round(base * distance_factor, 2)

            Ride.objects.create(
                customer=customer,
                driver=driver,
                pickup=pickup,
                destination=destination,
                status=status,
                fare=fare,
                time=time,
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} rides."))
