from django.db import models
from users.models import User

class Ticket(models.Model):
    CATEGORY_CHOICES = [
        ('refund', 'Refund'),
        ('complaint', 'Complaint'),
        ('technical', 'Technical'),
    ]
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('resolving', 'Resolving'),
        ('resolved', 'Resolved'),
    ]
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    assignee = models.CharField(max_length=100)
    created = models.DateTimeField()
    last_reply = models.DateTimeField()

class Refund(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    request_date = models.DateTimeField()

class ChatMessage(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    sender = models.CharField(max_length=100)
    message = models.TextField()
    timestamp = models.DateTimeField()
    is_support = models.BooleanField(default=False)

class Escalation(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    level = models.PositiveIntegerField()
    escalated_by = models.CharField(max_length=100)
    escalated_at = models.DateTimeField()
    notes = models.TextField()