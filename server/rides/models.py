from django.db import models
from users.models import User
from drivers.models import Driver

class Ride(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    pickup = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    fare = models.DecimalField(max_digits=8, decimal_places=2)
    time = models.DateTimeField()