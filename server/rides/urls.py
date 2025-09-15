from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_rides, name='rides-list'),
    path('stats/', views.ride_stats, name='rides-stats'),
]