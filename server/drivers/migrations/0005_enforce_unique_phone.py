from django.db import migrations, models
from django.db.models import Count


def dedupe_driver_phones(apps, schema_editor):
    Driver = apps.get_model('drivers', 'Driver')
    duplicates = (
        Driver.objects.values('phone')
        .annotate(num=Count('id'))
        .filter(num__gt=1)
    )
    for row in duplicates:
        phone = row['phone']
        drivers = list(Driver.objects.filter(phone=phone).order_by('id'))
        keep = drivers[0]
        for d in drivers[1:]:
            suffix = f"_{d.id}"
            max_len = 20
            base = (phone or "")[: max_len - len(suffix)]
            new_phone = f"{base}{suffix}"
            if new_phone == keep.phone:
                new_phone = f"{base}_dup{d.id}"
            d.phone = new_phone
            d.save(update_fields=['phone'])


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0004_enforce_non_negative'),
    ]

    operations = [
        migrations.RunPython(dedupe_driver_phones, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='driver',
            name='phone',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]


