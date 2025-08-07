from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Pedido
from .serializers import PedidoSerializer

@api_view(['GET'])
def pedidos_por_estado_y_repartidor(request):
    estado = request.GET.get('estado', 'ENV')
    idven = request.GET.get('idven', None)

    if idven is None:
        return Response({'error': 'Debe proporcionar idven'}, status=400)

    pedidos = Pedido.objects.filter(estped=estado, idven=idven)
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def dashboard_stats(request):
    """Obtener estadísticas generales para el dashboard"""
    try:
        # Estadísticas principales
        total_orders = Pedido.objects.count()
        pending_orders = Pedido.objects.filter(estped='PEN').count()
        delivered_orders = Pedido.objects.filter(estped='ENT').count()
        in_transit_orders = Pedido.objects.filter(estped='ENV').count()
        
        # Total de ingresos
        total_revenue = Pedido.objects.aggregate(total=Sum('totped'))['total'] or 0
        
        # Clientes únicos
        total_clients = Pedido.objects.values('idclie').distinct().count()
        
        # Choferes activos
        active_drivers = Pedido.objects.values('idven').distinct().count()
        
        return Response({
            'totalOrders': total_orders,
            'pendingOrders': pending_orders,
            'deliveredOrders': delivered_orders,
            'inTransitOrders': in_transit_orders,
            'urgentOrders': 0,  # Agregar lógica para urgentes si existe campo
            'totalRevenue': float(total_revenue),
            'totalClients': total_clients,
            'activeDrivers': active_drivers
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def monthly_orders(request):
    """Obtener pedidos por mes para el gráfico"""
    try:
        # Obtener los últimos 6 meses
        today = timezone.now().date()
        six_months_ago = today - timedelta(days=180)
        
        # Agrupar por mes
        monthly_data = Pedido.objects.filter(
            fecped__gte=six_months_ago
        ).extra(
            select={'month': "DATE_FORMAT(fecped, '%%Y-%%m')"}
        ).values('month').annotate(
            orders=Count('idoped')
        ).order_by('month')
        
        # Formatear los datos
        months_map = {
            '01': 'Ene', '02': 'Feb', '03': 'Mar',
            '04': 'Abr', '05': 'May', '06': 'Jun',
            '07': 'Jul', '08': 'Ago', '09': 'Sep',
            '10': 'Oct', '11': 'Nov', '12': 'Dic'
        }
        
        formatted_data = []
        for item in monthly_data:
            month_num = item['month'].split('-')[1]
            formatted_data.append({
                'month': months_map.get(month_num, month_num),
                'orders': item['orders']
            })
        
        return Response(formatted_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def recent_orders(request):
    """Obtener pedidos recientes para la lista"""
    try:
        recent = Pedido.objects.order_by('-fecped', '-hora')[:10]
        
        orders_data = []
        for pedido in recent:
            # Mapear estados
            status_map = {
                'PEN': 'pending',
                'ENV': 'in_transit', 
                'ENT': 'delivered'
            }
            
            orders_data.append({
                'id': f"#{pedido.idoped}",
                'client': f"Cliente {pedido.idclie}",  # Aquí podrías hacer join con tabla clientes
                'status': status_map.get(pedido.estped, 'pending'),
                'category': 'General',  # Agregar lógica para categorías si existe campo
                'urgent': False,  # Agregar lógica para urgentes si existe campo
                'date': pedido.fecped.strftime('%Y-%m-%d') if pedido.fecped else '',
                'total': float(pedido.totped)
            })
        
        return Response(orders_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
