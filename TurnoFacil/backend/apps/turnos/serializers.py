# turnos/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario, Medico, Turno

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'dni', 'telefono', 'is_staff')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('Usuario desactivado')
            else:
                raise serializers.ValidationError('Credenciales inválidas')
        else:
            raise serializers.ValidationError('Debe proporcionar username y password')
        
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'dni', 'telefono')
    
    def create(self, validated_data):
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', ''),
            dni=validated_data.get('dni', '')
        )
        return user

class MedicoSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='usuario.first_name', read_only=True)
    apellido = serializers.CharField(source='usuario.last_name', read_only=True)
    email = serializers.CharField(source='usuario.email', read_only=True)
    
    class Meta:
        model = Medico
        fields = ('id', 'nombre', 'apellido', 'especialidad', 'email', 'telefono_consultorio', 'direccion_consultorio')

class TurnoSerializer(serializers.ModelSerializer):
    paciente_first_name = serializers.CharField(source='paciente.first_name', read_only=True)
    paciente_last_name = serializers.CharField(source='paciente.last_name', read_only=True)
    paciente_dni = serializers.CharField(source='paciente.dni', read_only=True)
    medico_nombre = serializers.SerializerMethodField()
    especialidad = serializers.CharField(source='medico.especialidad', read_only=True)
    direccion = serializers.CharField(source='medico.direccion_consultorio', read_only=True)
    
    class Meta:
        model = Turno
        fields = '_all_'
    
    def get_medico_nombre(self, obj):
        return f"Dr. {obj.medico.usuario.first_name} {obj.medico.usuario.last_name}"