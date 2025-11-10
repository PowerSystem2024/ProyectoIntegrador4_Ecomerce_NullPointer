FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y gcc libpq-dev curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY TurnoFacil/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY TurnoFacil/backend/ .

RUN mkdir -p /app/staticfiles

ENV DJANGO_SETTINGS_MODULE=turno_facil.settings

RUN python manage.py collectstatic --noinput --clear || echo "Collectstatic failed"

EXPOSE $PORT

CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:$PORT"]
