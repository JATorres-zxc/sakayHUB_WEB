from django.db import models

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
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_CHOICES)
    license_status = models.CharField(max_length=12, choices=LICENSE_CHOICES)
    rating = models.FloatField(default=0)
    total_rides = models.PositiveIntegerField(default=0)
    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    online = models.BooleanField(default=False)
    join_date = models.DateField()
    last_active = models.DateTimeField()