from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError
import uuid

class Driver(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('pending', 'Pending'),
    ]
    LICENSE_CHOICES = [
        ('verified', 'Verified'),
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('rejected', 'Rejected'),
    ]
    VEHICLE_CHOICES = [
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('motorcycle', 'Motorcycle'),
        ('van', 'Van'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_CHOICES)
    license_status = models.CharField(max_length=12, choices=LICENSE_CHOICES)
    rating = models.FloatField(default=0)
    total_rides = models.PositiveIntegerField(default=0)
    total_sakays = models.PositiveIntegerField(default=0)
    number_of_cancellations = models.PositiveIntegerField(default=0)
    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    online = models.BooleanField(default=False)
    feedback = models.TextField(blank=True, default="")
    license_number = models.CharField(max_length=64, blank=True, null=True, unique=True)
    license_expiry = models.DateField(blank=True, null=True)
    license_photo = models.ImageField(upload_to="drivers/license_photos/", blank=True, null=True)
    vehicle_model = models.CharField(max_length=100, blank=True, default="")
    vehicle_color = models.CharField(max_length=50, blank=True, default="")
    plate_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    profile_photo = models.ImageField(upload_to="drivers/profile_photos/", blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    join_date = models.DateField()
    last_active = models.DateTimeField()

    class Meta:
        constraints = [
            models.CheckConstraint(check=Q(total_rides__gte=0), name="driver_total_rides_non_negative"),
            models.CheckConstraint(check=Q(earnings__gte=0), name="driver_earnings_non_negative"),
            models.CheckConstraint(check=Q(total_sakays__gte=0), name="driver_total_sakays_non_negative"),
            models.CheckConstraint(check=Q(number_of_cancellations__gte=0), name="driver_cancellations_non_negative"),
        ]

    def clean(self):
        errors = {}
        if self.total_rides is not None and self.total_rides < 0:
            errors["total_rides"] = "Total rides cannot be negative."
        if self.earnings is not None and self.earnings < 0:
            errors["earnings"] = "Earnings cannot be negative."
        if self.total_sakays is not None and self.total_sakays < 0:
            errors["total_sakays"] = "Total sakays cannot be negative."
        if self.number_of_cancellations is not None and self.number_of_cancellations < 0:
            errors["number_of_cancellations"] = "Number of cancellations cannot be negative."
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


def generate_application_reference() -> str:
    return f"APP-{uuid.uuid4().hex[:8].upper()}"


class DriverApplication(models.Model):
    APPLICATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    VEHICLE_CHOICES = [
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('motorcycle', 'Motorcycle'),
        ('van', 'Van'),
    ]

    reference_number = models.CharField(max_length=20, unique=True, editable=False, default=generate_application_reference)
    first_name = models.CharField(max_length=100, default='')
    last_name = models.CharField(max_length=100, default='')
    name = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    province = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_CHOICES, default='motorcycle')
    vehicle_model = models.CharField(max_length=100, blank=True)
    vehicle_color = models.CharField(max_length=50, blank=True)
    license_plate = models.CharField(max_length=32, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    or_number = models.CharField(max_length=64, blank=True)
    cr_number = models.CharField(max_length=64, blank=True)
    service_types = models.JSONField(default=list, blank=True)
    license_file = models.FileField(upload_to='driver_applications/licenses/', null=True, blank=True)
    orcr_file = models.FileField(upload_to='driver_applications/orcr/', null=True, blank=True)
    nbi_file = models.FileField(upload_to='driver_applications/nbi/', null=True, blank=True)
    status = models.CharField(max_length=12, choices=APPLICATION_STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-applied_at']

    def save(self, *args, **kwargs):
        if not self.name:
            full = f"{self.first_name} {self.last_name}".strip()
            self.name = full or self.name
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.reference_number} - {self.name or self.email}"


class DriverApplicationMotorPhoto(models.Model):
    application = models.ForeignKey(DriverApplication, related_name='motor_photos', on_delete=models.CASCADE)
    photo = models.FileField(upload_to='driver_applications/motor_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self) -> str:
        return f"Photo for {self.application.reference_number} @ {self.uploaded_at.isoformat()}"
