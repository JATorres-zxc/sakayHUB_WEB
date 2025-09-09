from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_drivers, name='drivers-list'),
    path('stats/', views.driver_stats, name='drivers-stats'),
]