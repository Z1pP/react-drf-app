# Generated by Django 5.0.3 on 2024-04-13 13:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0006_carlink'),
    ]

    operations = [
        migrations.AlterField(
            model_name='car',
            name='slug',
            field=models.SlugField(max_length=100, verbose_name='Слуг автомобиля'),
        ),
    ]
