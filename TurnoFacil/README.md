# 🏥 Turno Fácil - Sistema de Gestión Médica

Sistema web completo para la gestión de turnos médicos con integración de pagos mediante Mercado Pago.

## ✨ Características

- ✅ Gestión completa de turnos médicos
- 💳 Integración con Mercado Pago
- 📄 Generación de comprobantes en PDF
- 👥 Panel de administración
- 🔐 Autenticación de usuarios
- 📱 Diseño responsive
- 🚀 Listo para producción

## 🛠 Tecnologías

### Backend
- Python 3.8+
- Django 4.2
- Django REST Framework
- PostgreSQL (producción) / SQLite (desarrollo)
- Mercado Pago SDK

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Mercado Pago JavaScript SDK
- jsPDF para generación de PDF

## 🚀 Instalación Rápida

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver