from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_drivers, name='drivers-list'),
    path('stats/', views.driver_stats, name='drivers-stats'),
    path('applications/', views.list_driver_applications, name='driver-applications-list'),
    path('applications/stats/', views.driver_application_stats, name='driver-applications-stats'),
]