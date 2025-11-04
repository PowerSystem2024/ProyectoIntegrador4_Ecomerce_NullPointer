from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pago
from .serializers import PagoSerializer
from .mercadopago_service import MercadoPagoService
from apps.turnos.models import Turno
import json

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    mercadopago_service = MercadoPagoService()

    @action(detail=False, methods=['post'])
    def crear_pago_turno(self, request):
        turno_id = request.data.get('turno_id')
        
        try:
            turno = Turno.objects.get(id=turno_id, paciente=request.user)
            
            pago_existente = Pago.objects.filter(turno=turno).first()
            if pago_existente:
                return Response({
                    'url_pago': pago_existente.url_pago,
                    'pago_id': pago_existente.id_mercadopago
                })

            monto = 2500.00
            descripcion = f"Consulta con {turno.medico.especialidad}"
            
            preference_response = self.mercadopago_service.crear_preferencia_pago(
                turno_id, monto, descripcion
            )

            if preference_response["status"] == 201:
                pago = Pago.objects.create(
                    turno=turno,
                    monto=monto,
                    id_mercadopago=preference_response["response"]["id"],
                    url_pago=preference_response["response"]["init_point"]
                )

                return Response({
                    'url_pago': pago.url_pago,
                    'pago_id': pago.id_mercadopago
                })
            else:
                return Response(
                    {'error': 'Error al crear el pago'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Turno.DoesNotExist:
            return Response(
                {'error': 'Turno no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
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