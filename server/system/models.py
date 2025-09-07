from django.db import models

class PromoCode(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
    ]
    TYPE_CHOICES = [
        ('discount', 'Discount'),
        ('free_ride', 'Free Ride'),
        ('referral', 'Referral'),
    ]
    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    value = models.CharField(max_length=20)
    usage = models.CharField(max_length=20)
    expiry = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

class AppVersion(models.Model):
    PLATFORM_CHOICES = [
        ('ios', 'iOS'),
        ('android', 'Android'),
        ('driver_ios', 'Driver iOS'),
        ('driver_android', 'Driver Android'),
    ]
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    current = models.CharField(max_length=20)
    latest = models.CharField(max_length=20)
    users = models.CharField(max_length=10)
    force_update = models.BooleanField(default=False)

class GeoZone(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    multiplier = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)