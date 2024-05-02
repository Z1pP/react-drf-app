from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Car, CarBrand, CarModel
from .serializers import (
    CarSerializer,
    CarCreateSerializer,
    CarModelSerializer,
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CarListView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = (AllowAny,)
    pagination_class = StandardResultsSetPagination


class CarDetailView(generics.RetrieveAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    lookup_field = 'id'
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()

        # Получение похожих машин кроме текущей
        similar_cars = Car.objects.filter(
            brand=self.object.brand,
            model=self.object.model
        ).exclude(id=self.object.id)[:3]

        serializer = self.get_serializer(self.object)
        similar_cars_serializer = self.get_serializer(similar_cars, many=True)

        data = serializer.data
        data['similar_cars'] = similar_cars_serializer.data

        return Response(data)

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)

        # обновление количества просмотров
        obj.views_count += 1
        obj.save()
        return obj

class CarModelsByBrandListView(generics.ListAPIView):
    serializer_class = CarModelSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        brand_name = self.kwargs.get('brand')
        if not brand_name:
            return Response({"error": "Brand name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            brand = CarBrand.objects.get(name=brand_name).id
        except CarBrand.DoesNotExist:
            return Response({"error": "Brand not found."}, status=status.HTTP_404_NOT_FOUND)

        models = CarModel.objects.filter(car_brand_id=brand).order_by('name')
        serializer = self.get_serializer(models, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CarCreateView(generics.CreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarCreateSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = CarCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CarUpdateView(generics.UpdateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class CarFilterListView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = (AllowAny,)
    pagination_class = StandardResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        query_params = request.query_params
        for field, value in query_params.items():
            queryset = queryset.filter(**{field: value})
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CarsByUserIdListView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = (AllowAny,)
    lookup_field = "pk"

    def list(self, request, *args, **kwargs):
        user = self.get_object()
        cars = Car.objects.filter(seller=user)
        serializer = self.get_serializer(cars, many=True)
        return Response(serializer.data)

    def get_object(self):
        user_pk = self.kwargs.get('pk')
        return User.objects.get(pk=user_pk)

class CarParamsListView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    params_type = ['color', 'year', 'car_body', 'transmission_type', 'drive_type',
                   'fuel_type', 'engine_capacity', 'brand__name']

    def list(self, request, *args, **kwargs):
        params = {}
        try:
            for param_type in self.params_type:
                if '__' in param_type:
                    values = Car.objects.order_by(param_type).values_list(param_type, flat=True).distinct()
                else:
                    values = Car.objects.order_by(param_type).values_list(param_type, flat=True).distinct()
                params[param_type] = list(values)
            return Response(params, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
