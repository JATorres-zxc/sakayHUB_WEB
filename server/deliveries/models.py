from django.db import models
from drivers.models import Driver

class Delivery(models.Model):
    STATUS_CHOICES = [
        ('shipping', 'Shipping'),
        ('delivered', 'Delivered'),
    ]
    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True)
    package = models.CharField(max_length=255)
    pickup = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    fee = models.DecimalField(max_digits=8, decimal_places=2)
    time = models.DateTimeField()
    proof_photo = models.ImageField(upload_to='proofs/photos/', null=True, blank=True)
    proof_signature = models.ImageField(upload_to='proofs/signatures/', null=True, blank=True)