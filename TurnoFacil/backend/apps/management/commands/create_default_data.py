from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.turnos.models import Medico, Usuario

class Command(BaseCommand):
    help = "Create default data for the application"

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Create superuser if not exists
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@turnofacil.com",
                password="admin123",
                first_name="Administrador",
                last_name="Sistema",
                dni="00000000"
            )
            self.stdout.write("Superuser created: admin/admin123")
        
        # Create default medicos if not exist
        medicos_data = [
            {
                "nombre": "María",
                "apellido": "González", 
                "especialidad": "Cardiología",
                "matricula": "CARD12345",
                "email": "maria.gonzalez@clinica.com",
                "telefono": "+54 11 1234-5678",
                "direccion": "Av. Corrientes 1234, Piso 3, Consultorio 5, Buenos Aires"
            },
            {
                "nombre": "Carlos",
                "apellido": "López",
                "especialidad": "Dermatología", 
                "matricula": "DERM12345",
                "email": "carlos.lopez@clinica.com",
                "telefono": "+54 11 2345-6789",
                "direccion": "Av. Santa Fe 567, Consultorio 12, Buenos Aires"
            }
        ]
        
        for medico_data in medicos_data:
            matricula = medico_data.pop("matricula")
            nombre = medico_data.pop("nombre")
            apellido = medico_data.pop("apellido")
            especialidad = medico_data.pop("especialidad")
            email = medico_data.pop("email")
            telefono = medico_data.pop("telefono")
            direccion = medico_data.pop("direccion")
            
            if not Medico.objects.filter(matricula=matricula).exists():
                # Create user for medico
                if not User.objects.filter(email=email).exists():
                    usuario = User.objects.create_user(
                        username=f"dr_{matricula.lower()}",
                        email=email,
                        password="medico123",
                        first_name=nombre,
                        last_name=apellido,
                        dni=f"DNI{matricula}",
                        telefono=telefono
                    )
                    
                    # Create medico
                    Medico.objects.create(
                        usuario=usuario,
                        especialidad=especialidad,
                        matricula=matricula,
                        direccion_consultorio=direccion,
                        telefono_consultorio=telefono
                    )
        
        self.stdout.write("Default data created successfully!")