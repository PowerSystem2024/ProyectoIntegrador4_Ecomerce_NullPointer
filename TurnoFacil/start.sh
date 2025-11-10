#!/bin/bash
# Script de inicio para Railway
cd backend
python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:$PORT