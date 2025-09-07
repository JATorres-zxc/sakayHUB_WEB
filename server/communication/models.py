from django.db import models

class Announcement(models.Model):
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('scheduled', 'Scheduled'),
        ('draft', 'Draft'),
    ]
    title = models.CharField(max_length=255)
    message = models.TextField()
    audience = models.CharField(max_length=50)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('promo', 'Promo'),
    ]
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    sent = models.DateTimeField()

class Campaign(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('draft', 'Draft'),
    ]
    TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push'),
    ]
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    recipients = models.PositiveIntegerField()
    opened = models.PositiveIntegerField(null=True, blank=True)
    clicked = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)