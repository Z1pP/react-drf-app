from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Car, CarBrand, CarModel
from .serializers import CarSerializer, CarCreateSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CarListView(generics.ListAPIView):
    queryset = Car.objects.all().order_by("-created")
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


class CarSearchByBrandView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = (AllowAny,)
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        brand = self.kwargs.get('brand')
        brand_id = CarBrand.objects.get(slug=brand).id
        return Car.objects.filter(brand=brand_id)


class CarSearchByModelView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = (AllowAny,)
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        model = self.kwargs.get('model')
        model_id = CarModel.objects.get(slug=model).id
        return Car.objects.filter(model=model_id)


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
