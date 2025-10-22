from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('drivers', '0005_enforce_unique_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='total_sakays',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='driver',
            name='number_of_cancellations',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='driver',
            name='feedback',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='driver',
            name='license_number',
            field=models.CharField(blank=True, max_length=64, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='driver',
            name='license_expiry',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='driver',
            name='license_photo',
            field=models.ImageField(blank=True, null=True, upload_to='drivers/license_photos/'),
        ),
        migrations.AddField(
            model_name='driver',
            name='vehicle_model',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='driver',
            name='vehicle_color',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AddField(
            model_name='driver',
            name='plate_number',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='driver',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to='drivers/profile_photos/'),
        ),
        migrations.AddField(
            model_name='driver',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddConstraint(
            model_name='driver',
            constraint=models.CheckConstraint(check=models.Q(total_sakays__gte=0), name='driver_total_sakays_non_negative'),
        ),
        migrations.AddConstraint(
            model_name='driver',
            constraint=models.CheckConstraint(check=models.Q(number_of_cancellations__gte=0), name='driver_cancellations_non_negative'),
        ),
    ]
