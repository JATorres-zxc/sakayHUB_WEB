import random
from datetime import timedelta, datetime

from django.core.management.base import BaseCommand
from django.utils import timezone

from deliveries.models import Delivery
from drivers.models import Driver


SENDERS = [
    "Acme Corp",
    "Bay Logistics",
    "QuickShip",
    "City Flowers",
    "Tech Gadgets",
    "Green Grocer",
]

RECEIVERS = [
    "John Smith",
    "Olivia Brown",
    "Noah Davis",
    "Emma Wilson",
    "Sophia Miller",
    "Liam Johnson",
]

PACKAGES = [
    "Small Box",
    "Medium Parcel",
    "Large Package",
    "Envelope",
    "Fragile Item",
    "Food Pack",
]

PICKUPS = [
    "Warehouse A",
    "Warehouse B",
    "Downtown Hub",
    "Airport Cargo",
    "City Market",
]

DESTINATIONS = [
    "Residential Blk 12",
    "Office Tower 3",
    "Retail Park",
    "Harbor Depot",
    "Eastwood Center",
]


class Command(BaseCommand):
    help = "Seed active deliveries (default 8 with status=shipping) for testing"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=8, help="Number of deliveries to create")
        parser.add_argument("--clear", action="store_true", help="Clear ALL deliveries before seeding")
        parser.add_argument("--delete-first", type=int, default=0, help="Delete the first N deliveries before seeding")

    def handle(self, *args, **options):
        count: int = options["count"]
        clear: bool = options["clear"]
        delete_first: int = options["delete_first"]

        if clear:
            deleted, _ = Delivery.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {deleted} existing deliveries."))

        elif delete_first > 0:
            qs = Delivery.objects.all().order_by("id")[:delete_first]
            deleted_count = qs.count()
            qs.delete()
            self.stdout.write(self.style.WARNING(f"Deleted the first {deleted_count} deliveries."))

        drivers = list(Driver.objects.all()[:100])
        if not drivers:
            self.stdout.write(self.style.ERROR("Requires at least 1 driver. Seed drivers first."))
            return

        created = 0
        for i in range(count):
            driver = random.choice(drivers)
            sender = random.choice(SENDERS)
            receiver = random.choice(RECEIVERS)
            package = random.choice(PACKAGES)
            pickup = random.choice(PICKUPS)
            destination = random.choice(DESTINATIONS)

            # Active shipping within last 48 hours — use timezone aware datetime
            hours_ago = random.randint(0, 48)
            minutes_offset = random.randint(0, 60)
            naive_time = datetime.utcnow() - timedelta(hours=hours_ago, minutes=minutes_offset)
            time = timezone.make_aware(naive_time)  # ✅ timezone-aware

            fee = round(random.uniform(4, 25), 2)

            Delivery.objects.create(
                sender=sender,
                receiver=receiver,
                driver=driver,
                package=package,
                pickup=pickup,
                destination=destination,
                status="shipping",
                fee=fee,
                time=time,
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} deliveries."))
