from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Pago
from .serializers import PagoSerializer
from .mercadopago_service import MercadoPagoService
from apps.turnos.models import Turno
import json

@method_decorator(csrf_exempt, name='dispatch')
class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    mercadopago_service = MercadoPagoService()

    @action(detail=False, methods=['post'])
    def crear_pago_turno(self, request):
        print(f"🔍 Crear pago - Data: {request.data}")
        print(f"🔍 Headers: {request.headers}")
        turno_id = request.data.get('turno_id')
        print(f"🔍 Turno ID: {turno_id}")
        
        try:
            # Para desarrollo: modo de prueba que no requiere turno real
            monto = 100.00
            descripcion = f"Consulta Médica - Turno #{turno_id}"
            print(f"🔍 Creando pago de prueba - Monto: {monto}, Descripción: {descripcion}")
            
            # Crear preferencia directamente
            preference_response = self.mercadopago_service.crear_preferencia_pago(
                turno_id, monto, descripcion
            )
            
            print(f"🔍 Respuesta MercadoPago: {preference_response}")

            if preference_response.get("status") == 201 or preference_response.get("init_point"):
                response_data = preference_response.get("response", preference_response)
                init_point = response_data.get("init_point")
                pago_id = response_data.get("id", f"test-{turno_id}")
                
                print(f"🔍 Pago creado exitosamente - ID: {pago_id}, URL: {init_point}")

                return Response({
                    'init_point': init_point,
                    'payment_url': init_point,
                    'pago_id': pago_id,
                    'status': 'success'
                })
            else:
                print(f"🔍 Error en MercadoPago: {preference_response}")
                return Response(
                    {'error': 'Error al crear el pago en MercadoPago'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print(f"🔍 ERROR general: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Error interno: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def webhook_mercadopago(self, request):
        data = request.data
        payment_id = data.get('data', {}).get('id')
        
        if payment_id:
            payment_response = self.mercadopago_service.verificar_pago(payment_id)
            
            if payment_response["status"] == 200:
                payment_data = payment_response["response"]
                
                try:
                    pago = Pago.objects.get(id_mercadopago=payment_id)
                    if payment_data["status"] == "approved":
                        pago.estado = "aprobado"
                        pago.turno.estado = "confirmado"
                        pago.turno.save()
                    elif payment_data["status"] == "rejected":
                        pago.estado = "rechazado"
                    
                    pago.save()
                    
                except Pago.DoesNotExist:
                    pass

        return Response({'status': 'ok'})