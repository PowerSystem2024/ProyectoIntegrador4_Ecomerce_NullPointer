# Railway Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requirements
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copiar aplicación
COPY backend/ .

# Comando de inicio
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT