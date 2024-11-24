from django.urls import path
from . import views


urlpatterns = [
    path("create", views.CarCreateView.as_view(), name="car_create"),
    path("update/<int:id>", views.CarUpdateView.as_view(), name="car_update"),
    path("delete/<int:id>", views.CarDeleteView.as_view(), name="car_delete"),
    path("list", views.CarListView.as_view(), name="car_list"),
    path("filter", views.CarFilterListView.as_view(), name="car_filter"),
    path(
        "models/<str:brand>",
        views.CarModelsByBrandListView.as_view(),
        name="car_models",
    ),
    path(
        "announcements/<int:pk>",
        views.CarsByUserIdListView.as_view(),
        name="announcement-cars",
    ),
    path("<int:id>", views.CarDetailView.as_view(), name="car_detail"),
    path("params", views.CarParamsListView.as_view(), name="cars-params"),
]
