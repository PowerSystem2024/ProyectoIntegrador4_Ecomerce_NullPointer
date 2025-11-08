# turnos/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from .models import Usuario, Medico, Turno
from .serializers import *

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response(UsuarioSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response(UsuarioSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        logout(request)
        return Response({'message': 'Sesión cerrada'})
    
    @action(detail=False, methods=['get'])
    def user(self, request):
        if request.user.is_authenticated:
            return Response(UsuarioSerializer(request.user).data)
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)

class MedicoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]

class TurnoViewSet(viewsets.ModelViewSet):
    queryset = Turno.objects.all()
    serializer_class = TurnoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Turno.objects.all()
        return Turno.objects.filter(paciente=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(paciente=self.request.user)
    
    @action(detail=True, methods=['get'])
    def comprobante(self, request, pk=None):
        turno = self.get_object()
        # Datos para el comprobante
        data = {
            'id': turno.id,
            'paciente_nombre': f"{turno.paciente.first_name} {turno.paciente.last_name}",
            'paciente_dni': turno.paciente.dni,
            'paciente_email': turno.paciente.email,
            'paciente_telefono': turno.paciente.telefono,
            'medico_nombre': f"Dr. {turno.medico.usuario.first_name} {turno.medico.usuario.last_name}",
            'especialidad': turno.medico.especialidad,
            'fecha': turno.fecha.strftime('%d/%m/%Y'),
            'hora': turno.hora.strftime('%H:%M'),
            'direccion': turno.medico.direccion_consultorio,
            'monto': float(turno.monto),
            'estado_pago': 'Pagado' if hasattr(turno, 'pago') and turno.pago.estado == 'aprobado' else 'Pendiente',
            'fecha_pago': turno.pago.fecha_pago.strftime('%d/%m/%Y') if hasattr(turno, 'pago') and turno.pago.fecha_pago else None,
            'id_transaccion': turno.pago.id_transaccion if hasattr(turno, 'pago') else None
        }
        return Response(data)