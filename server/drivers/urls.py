from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_drivers, name='drivers-list'),
    path('stats/', views.driver_stats, name='drivers-stats'),
    path('applications/', views.list_driver_applications, name='driver-applications-list'),
    path('applications/stats/', views.driver_application_stats, name='driver-applications-stats'),
    path('<int:driver_id>/status/', views.update_driver_status, name='driver-update-status'),
    path('<int:driver_id>/suspend/', views.suspend_driver, name='driver-suspend'),
    path('<int:driver_id>/unsuspend/', views.unsuspend_driver, name='driver-unsuspend'),
]