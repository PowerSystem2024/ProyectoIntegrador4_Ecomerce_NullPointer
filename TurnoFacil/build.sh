#!/bin/bash
# Build script para Render
echo "🔧 Starting build process..."

echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "✅ Build completed successfully!"