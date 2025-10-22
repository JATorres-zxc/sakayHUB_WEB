from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from drivers.models import DriverApplication, DriverApplicationMotorPhoto


class Command(BaseCommand):
    help = "Create a persistent demo driver application record with sample uploads."

    def add_arguments(self, parser):
        parser.add_argument("--email", help="Email address for the demo application.")
        parser.add_argument("--first-name", help="Applicant first name.")
        parser.add_argument("--last-name", help="Applicant last name.")
        parser.add_argument("--phone", help="Contact number.")
        parser.add_argument("--vehicle-type", help="Vehicle type (sedan/suv/motorcycle/van).")
        parser.add_argument("--vehicle-model", help="Vehicle model.")
        parser.add_argument("--vehicle-color", help="Vehicle color.")
        parser.add_argument("--license-plate", help="License plate number.")
        parser.add_argument("--license-number", help="Driver license number.")
        parser.add_argument("--service-types", help='Comma-separated service types e.g. "ride_hailing,food_delivery".')

    def handle(self, *args, **options):
        base_prefix = "demo.applicant"
        existing_demo_count = DriverApplication.objects.filter(email__startswith=base_prefix).count()

        email = (options.get("email") or f"{base_prefix}{existing_demo_count + 1}@sakayhub.local").strip().lower()
        first_name = (options.get("first_name") or f"Demo{existing_demo_count + 1}").strip()
        last_name = (options.get("last_name") or "Applicant").strip()
        phone = (options.get("phone") or f"+63 912 34{existing_demo_count:03d} 000").strip()
        vehicle_type = (options.get("vehicle_type") or "motorcycle").strip().lower()
        vehicle_model = (options.get("vehicle_model") or "Honda Click 150i").strip()
        vehicle_color = (options.get("vehicle_color") or "Red").strip()
        license_plate = (options.get("license_plate") or f"TEST-{existing_demo_count + 1:03d}").strip().upper()
        license_number = (options.get("license_number") or f"DL{existing_demo_count + 1:09d}").strip().upper()

        service_types_option = options.get("service_types")
        if service_types_option:
            service_types = [item.strip() for item in service_types_option.split(",") if item.strip()]
        else:
            service_types = ["ride_hailing", "food_delivery"]

        existing = DriverApplication.objects.filter(email=email).first()
        if existing:
            self.stdout.write(
                self.style.WARNING(
                    f"Driver application for email '{email}' already exists with reference "
                    f"{existing.reference_number}. No new record created."
                )
            )
            return

        application = DriverApplication.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            address="123 Sample Street",
            city="Quezon City",
            province="Metro Manila",
            zip_code="1100",
            vehicle_type=vehicle_type,
            vehicle_model=vehicle_model,
            vehicle_color=vehicle_color,
            license_plate=license_plate,
            license_number=license_number,
            or_number=f"OR-{existing_demo_count + 1:07d}",
            cr_number=f"CR-{existing_demo_count + 1:07d}",
            service_types=service_types,
            status="pending",
        )

        unique_suffix = f"{application.pk}"
        license_content = ContentFile(b"Demo driver's license file", name=f"license-demo-{unique_suffix}.txt")
        orcr_content = ContentFile(b"Demo OR/CR file", name=f"orcr-demo-{unique_suffix}.txt")
        motor_content = ContentFile(b"Demo motor photo bytes", name=f"motor-photo-demo-{unique_suffix}.jpg")

        application.license_file.save(license_content.name, license_content, save=True)
        application.orcr_file.save(orcr_content.name, orcr_content, save=True)

        DriverApplicationMotorPhoto.objects.create(application=application, photo=motor_content)

        self.stdout.write(
            self.style.SUCCESS(
                f"Demo driver application created with reference number {application.reference_number}."
            )
        )
