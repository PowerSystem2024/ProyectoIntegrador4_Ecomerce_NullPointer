FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND noninteractive

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        curl \
        gcc \
        python3-dev \
        musl-dev \
    && rm -rf /var/lib/apt/lists/*

# Create and set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create static files directory
RUN mkdir -p /app/staticfiles

# Create wait-for-db script
RUN echo '#!/bin/bash\n\
until pg_isready -h db -p 5432 -U turnofacil_user; do\n\
  echo "Waiting for database..."\n\
  sleep 2\n\
done\n\
echo "Database is ready!"' > /app/wait_for_db.sh && chmod +x /app/wait_for_db.sh

# Create management command for waiting database
RUN echo 'from django.core.management.base import BaseCommand\n\
import subprocess\n\
import sys\n\
\n\
class Command(BaseCommand):\n\
    help = "Wait for database to be ready"\n\
\n\
    def handle(self, *args, **options):\n\
        self.stdout.write("Waiting for database...")\n\
        result = subprocess.run(["/app/wait_for_db.sh"], capture_output=True, text=True)\n\
        if result.returncode != 0:\n\
            self.stderr.write("Database is not ready!")\n\
            sys.exit(1)\n\
        self.stdout.write("Database is ready!")' > /app/apps/management/commands/wait_for_db.py

# Create default data command
RUN echo 'from django.core.management.base import BaseCommand\n\
from django.contrib.auth import get_user_model\n\
from apps.turnos.models import Medico\n\
\n\
class Command(BaseCommand):\n\
    help = "Create default data for the application"\n\
\n\
    def handle(self, *args, **options):\n\
        User = get_user_model()\n\
        \n\
        # Create superuser if not exists\n\
        if not User.objects.filter(username="admin").exists():\n\
            User.objects.create_superuser(\n\
                username="admin",\n\
                email="admin@turnofacil.com",\n\
                password="admin123",\n\
                first_name="Administrador",\n\
                last_name="Sistema",\n\
                dni="00000000"\n\
            )\n\
            self.stdout.write("Superuser created: admin/admin123")\n\
        \n\
        # Create default medicos if not exist\n\
        medicos_data = [\n\
            {\n\
                "nombre": "María",\n\
                "apellido": "González",\n\
                "especialidad": "Cardiología",\n\
                "matricula": "CARD12345",\n\
                "email": "maria.gonzalez@clinica.com",\n\
                "telefono": "+54 11 1234-5678",\n\
                "direccion": "Av. Corrientes 1234, Piso 3, Consultorio 5, Buenos Aires"\n\
            },\n\
            {\n\
                "nombre": "Carlos",\n\
                "apellido": "López",\n\
                "especialidad": "Dermatología",\n\
                "matricula": "DERM12345",\n\
                "email": "carlos.lopez@clinica.com",\n\
                "telefono": "+54 11 2345-6789",\n\
                "direccion": "Av. Santa Fe 567, Consultorio 12, Buenos Aires"\n\
            },\n\
            {\n\
                "nombre": "Ana",\n\
                "apellido": "Martínez",\n\
                "especialidad": "Odontología",\n\
                "matricula": "ODON12345",\n\
                "email": "ana.martinez@clinica.com",\n\
                "telefono": "+54 11 3456-7890",\n\
                "direccion": "Av. Cabildo 789, Local 4, Buenos Aires"\n\
            },\n\
            {\n\
                "nombre": "Roberto",\n\
                "apellido": "Sánchez",\n\
                "especialidad": "Pediatría",\n\
                "matricula": "PED12345",\n\
                "email": "roberto.sanchez@clinica.com",\n\
                "telefono": "+54 11 4567-8901",\n\
                "direccion": "Av. Rivadavia 2345, Piso 2, Consultorio 8, Buenos Aires"\n\
            }\n\
        ]\n\
        \n\
        for medico_data in medicos_data:\n\
            if not Medico.objects.filter(matricula=medico_data["matricula"]).exists():\n\
                Medico.objects.create(**medico_data)\n\
        \n\
        self.stdout.write("Default data created successfully!")' > /app/apps/management/commands/create_default_data.py

# Create necessary directories
RUN mkdir -p /app/apps/management/commands

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "turno_facil.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]