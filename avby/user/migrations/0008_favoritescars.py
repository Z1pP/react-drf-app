# Generated by Django 5.0.3 on 2024-04-23 00:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0009_alter_car_views_count'),
        ('user', '0007_alter_userprofileinfo_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FavoritesCars',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by_users', to='cars.car')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorite_cars', to='user.userprofileinfo')),
            ],
            options={
                'unique_together': {('user', 'car')},
            },
        ),
    ]
