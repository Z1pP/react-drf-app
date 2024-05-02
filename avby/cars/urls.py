from django.urls import path
from . import views


urlpatterns = [
    path('v1/cars/create', views.CarCreateView.as_view(), name='car_create'),
    path('v1/cars/update/<int:id>', views.CarUpdateView.as_view(), name='car_update'),
    path('v1/cars/list', views.CarListView.as_view(), name='car_list'),
    path('v1/cars/filter', views.CarFilterListView.as_view(), name='car_filter'),
    path('v1/cars/models/<str:brand>', views.CarModelsByBrandListView.as_view(), name='car_models'),
    path('v1/cars/announcements/<int:pk>', views.CarsByUserIdListView.as_view(), name='announcement-cars'),
    path('v1/cars/<int:id>', views.CarDetailView.as_view(), name='car_detail'),
    path('v1/cars/params', views.CarParamsListView.as_view(), name='cars-params'),
]