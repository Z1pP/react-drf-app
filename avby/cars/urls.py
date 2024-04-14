from django.urls import path
from . import views


urlpatterns = [
    path('v1/cars/create', views.CarCreateView.as_view(), name='car_create'),
    path('v1/cars/update/<int:id>', views.CarUpdateView.as_view(), name='car_update'),
    path('v1/cars/list', views.CarListView.as_view(), name='car_list'),
    path('v1/cars/<int:id>', views.CarDetailView.as_view(), name='car_detail'),
    path('v1/cars/<slug:brand>', views.CarSearchByBrandView.as_view(), name='cars_by_brand>'),
    path('v1/cars/<str:brand>/<str:model>', views.CarSearchByModelView.as_view(), name='cars_by_model'),
]