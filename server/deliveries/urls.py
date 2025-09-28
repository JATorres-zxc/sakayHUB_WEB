from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_deliveries, name='deliveries-list'),
    path('stats/', views.delivery_stats, name='deliveries-stats'),
]