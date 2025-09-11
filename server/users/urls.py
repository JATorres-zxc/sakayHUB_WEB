from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.csrf, name='csrf'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('me/', views.me, name='me'),
    path('list/', views.list_users, name='users-list'),
    path('<int:user_id>/status/', views.update_user_status, name='user-update-status'),
]