# Generated by Django 5.0.3 on 2024-04-06 17:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Car',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Car name')),
                ('model', models.CharField(max_length=100, verbose_name='Car model')),
                ('brand', models.CharField(max_length=100, verbose_name='Car brand')),
                ('slug', models.SlugField(max_length=100, unique=True, verbose_name='Car slug')),
                ('engine_capacity', models.CharField(blank=True, max_length=20, verbose_name='Engine capacity')),
                ('fuel_type', models.CharField(blank=True, max_length=20, verbose_name='Fuel type')),
                ('drive_type', models.CharField(blank=True, max_length=20, verbose_name='Drive type')),
                ('transmission_type', models.CharField(blank=True, max_length=20, verbose_name='Gearbox')),
                ('car_body', models.CharField(blank=True, max_length=20, verbose_name='Car body')),
                ('milage', models.CharField(blank=True, max_length=20, verbose_name='Milage')),
                ('year', models.CharField(blank=True, max_length=10, verbose_name='Year')),
                ('condition', models.CharField(blank=True, max_length=20, verbose_name='Condition')),
                ('color', models.CharField(blank=True, max_length=20, verbose_name='Color')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Price')),
                ('seller', models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, related_name='cars_for_sale', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CarPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_url', models.URLField(blank=True, verbose_name='Photo URL')),
                ('photo', models.ImageField(upload_to='cars_photo/', verbose_name='Photo')),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cars.car')),
            ],
        ),
    ]
