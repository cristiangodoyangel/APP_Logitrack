from rest_framework.decorators import api_view
from rest_framework.response import Response
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
