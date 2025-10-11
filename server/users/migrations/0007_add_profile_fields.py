from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0006_fix_status_choices_and_cleanup'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
        migrations.AddField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='favorite_locations',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
