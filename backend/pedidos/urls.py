from django.urls import path
from .views import pedidos_por_estado_y_repartidor

urlpatterns = [
    path('pedidos/', pedidos_por_estado_y_repartidor),
]
