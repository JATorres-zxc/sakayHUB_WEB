cfrom django.db import migrations, models
from django.db.models import Count


def dedupe_user_phones(apps, schema_editor):
    User = apps.get_model('users', 'User')
    # Find duplicate phone values
    duplicates = (
        User.objects.values('phone')
        .annotate(num=Count('id'))
        .filter(num__gt=1)
    )
    for row in duplicates:
        phone = row['phone']
        # Keep the smallest id, modify the rest
        users = list(User.objects.filter(phone=phone).order_by('id'))
        keep = users[0]
        for u in users[1:]:
            suffix = f"_{u.id}"
            max_len = 20
            base = (phone or "")[: max_len - len(suffix)]
            new_phone = f"{base}{suffix}"
            if new_phone == keep.phone:  # extremely unlikely, but guard
                new_phone = f"{base}_dup{u.id}"
            u.phone = new_phone
            u.save(update_fields=['phone'])


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_enforce_non_negative'),
    ]

    operations = [
        migrations.RunPython(dedupe_user_phones, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]


