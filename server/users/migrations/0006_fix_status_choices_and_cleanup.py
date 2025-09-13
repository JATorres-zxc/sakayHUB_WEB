from django.db import migrations, models


def replace_inactive_with_suspended(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(status='inactive').update(status='suspended')


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_enforce_unique_phone'),
    ]

    operations = [
        migrations.RunPython(replace_inactive_with_suspended, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name='user',
            constraint=models.CheckConstraint(
                name='user_status_allowed_values',
                check=models.Q(('status__in', ['active', 'suspended'])),
            ),
        ),
    ]


