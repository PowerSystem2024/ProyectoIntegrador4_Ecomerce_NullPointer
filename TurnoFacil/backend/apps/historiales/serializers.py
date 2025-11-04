from rest_framework import serializers
from .models import HistorialMedico

class HistorialMedicoSerializer(serializers.ModelSerializer):
    medico_nombre = serializers.CharField(source='medico._str_', read_only=True)
    especialidad = serializers.CharField(source='medico.especialidad', read_only=True)

    class Meta:
        model = HistorialMedico
        fields = '_all_'
        read_only_fields = ('paciente', 'created_at', 'updated_at')