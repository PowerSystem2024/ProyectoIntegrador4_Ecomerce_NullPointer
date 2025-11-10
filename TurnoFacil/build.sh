#!/bin/bash
# Script de build para Railway
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput || echo "No static files"