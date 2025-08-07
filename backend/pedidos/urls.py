from django.urls import path
from .views import pedidos_por_estado_y_repartidor, dashboard_stats, monthly_orders, recent_orders

urlpatterns = [
    path('pedidos/', pedidos_por_estado_y_repartidor),
    path('dashboard/stats/', dashboard_stats),
    path('dashboard/monthly/', monthly_orders),
    path('dashboard/recent/', recent_orders),
]
