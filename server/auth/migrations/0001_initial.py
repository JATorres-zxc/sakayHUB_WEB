from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MobileProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('user', 'User'), ('driver', 'Driver')], max_length=10)),
                ('name', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=20, unique=True)),
                ('is_phone_verified', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=models.deletion.CASCADE, related_name='mobile_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'indexes': [models.Index(fields=['phone'], name='mobile_prof_phone_idx')],
            },
        ),
        migrations.CreateModel(
            name='PhoneVerification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone', models.CharField(max_length=20)),
                ('role', models.CharField(choices=[('user', 'User'), ('driver', 'Driver')], max_length=10)),
                ('code', models.CharField(max_length=6)),
                ('hashed_password', models.CharField(max_length=128)),
                ('payload', models.JSONField(default=dict)),
                ('attempts', models.PositiveSmallIntegerField(default=0)),
                ('expires_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'unique_together': {('phone', 'role')},
            },
        ),
    ]
