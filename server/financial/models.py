from django.db import models
from users.models import User
from drivers.models import Driver

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('ride', 'Ride'),
        ('delivery', 'Delivery'),
        ('refund', 'Refund'),
    ]
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('processed', 'Processed'),
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    commission = models.DecimalField(max_digits=8, decimal_places=2)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    timestamp = models.DateTimeField()

class Payout(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    rides = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    request_date = models.DateField()

class Promo(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
    ]
    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=20)
    value = models.CharField(max_length=20)
    usage = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    expires = models.DateField(null=True, blank=True)