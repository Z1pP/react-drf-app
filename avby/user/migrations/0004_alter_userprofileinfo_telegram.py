# Generated by Django 5.0.3 on 2024-03-29 12:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('telegram', '0002_tguser_created'),
        ('user', '0003_alter_userprofileinfo_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofileinfo',
            name='telegram',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profile', to='telegram.tguser'),
        ),
    ]
