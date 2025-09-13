from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError

class User(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]
    KYC_CHOICES = [
        ('verified', 'Verified'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    kyc_status = models.CharField(max_length=10, choices=KYC_CHOICES)
    total_rides = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    join_date = models.DateField()
    last_active = models.DateTimeField()

    class Meta:
        constraints = [
            models.CheckConstraint(check=Q(total_rides__gte=0), name="user_total_rides_non_negative"),
            models.CheckConstraint(check=Q(total_spent__gte=0), name="user_total_spent_non_negative"),
        ]

    def clean(self):
        # Ensure non-negative values at the model validation level
        errors = {}
        if self.total_rides is not None and self.total_rides < 0:
            errors["total_rides"] = "Total rides cannot be negative."
        if self.total_spent is not None and self.total_spent < 0:
            errors["total_spent"] = "Total spent cannot be negative."
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        # Enforce validators and clean() on every save, including shell usage
        self.full_clean()
        return super().save(*args, **kwargs)