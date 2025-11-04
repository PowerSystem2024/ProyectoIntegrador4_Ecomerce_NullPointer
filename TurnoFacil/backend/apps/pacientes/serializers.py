from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Paciente

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'dni', 'telefono', 'fecha_nacimiento', 'direccion', 'is_staff')
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'read_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        validated_data['password'] = make_password(password)
        return super().create(validated_data)