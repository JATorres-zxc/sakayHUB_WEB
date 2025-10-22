import uuid
import django.db.models.deletion
from django.db import migrations, models
import drivers.models


def populate_reference_numbers(apps, schema_editor):
    DriverApplication = apps.get_model('drivers', 'DriverApplication')
    existing_refs = set(
        DriverApplication.objects.exclude(reference_number='').values_list('reference_number', flat=True)
    )

    def generate_unique():
        while True:
            ref = f"APP-{uuid.uuid4().hex[:8].upper()}"
            if ref not in existing_refs:
                existing_refs.add(ref)
                return ref

    for application in DriverApplication.objects.all():
        if not application.reference_number:
            application.reference_number = generate_unique()
            application.save(update_fields=['reference_number'])


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0005_enforce_unique_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='driverapplication',
            name='address',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='city',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='cr_number',
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='first_name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='last_name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='license_file',
            field=models.FileField(blank=True, null=True, upload_to='driver_applications/licenses/'),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='license_plate',
            field=models.CharField(blank=True, max_length=32),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='nbi_file',
            field=models.FileField(blank=True, null=True, upload_to='driver_applications/nbi/'),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='or_number',
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='orcr_file',
            field=models.FileField(blank=True, null=True, upload_to='driver_applications/orcr/'),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='province',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='reference_number',
            field=models.CharField(default='', editable=False, max_length=20),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='service_types',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='vehicle_color',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='vehicle_model',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='driverapplication',
            name='zip_code',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.RunPython(populate_reference_numbers, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='driverapplication',
            name='reference_number',
            field=models.CharField(default=drivers.models.generate_application_reference, editable=False, max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='driverapplication',
            name='applied_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='driverapplication',
            name='license_number',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='driverapplication',
            name='name',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='driverapplication',
            name='vehicle_type',
            field=models.CharField(choices=[('sedan', 'Sedan'), ('suv', 'SUV'), ('motorcycle', 'Motorcycle'), ('van', 'Van')], default='motorcycle', max_length=20),
        ),
        migrations.CreateModel(
            name='DriverApplicationMotorPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.FileField(upload_to='driver_applications/motor_photos/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='motor_photos', to='drivers.driverapplication')),
            ],
            options={
                'ordering': ['uploaded_at'],
            },
        ),
    ]
