# turnos/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Usuario(AbstractUser):
    dni = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.TextField(blank=True, null=True)
    
    def _str_(self):
        return f"{self.first_name} {self.last_name}"

class Medico(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)
    matricula = models.CharField(max_length=50, unique=True)
    direccion_consultorio = models.TextField()
    telefono_consultorio = models.CharField(max_length=20)
    horario_atencion = models.CharField(max_length=100, default="Lunes a Viernes 8:00-17:00")
    
    def _str_(self):
        return f"Dr. {self.usuario.first_name} {self.usuario.last_name} - {self.especialidad}"

class Turno(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    
    paciente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='turnos_paciente')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    monto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['fecha', 'hora']
    
    def _str_(self):
        return f"Turno {self.id} - {self.paciente} con {self.medico}"

# El modelo Pago se encuentra en la app pagos