from rest_framework import viewsets
from .models import HistorialMedico
from .serializers import HistorialMedicoSerializer

class HistorialMedicoViewSet(viewsets.ModelViewSet):
    serializer_class = HistorialMedicoSerializer
    queryset = HistorialMedico.objects.all()

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return HistorialMedico.objects.filter(paciente=self.request.user)
        return HistorialMedico.objects.none()