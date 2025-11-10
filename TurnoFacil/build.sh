#!/bin/bash
# Build script para Render
echo "🔧 Starting build process..."
echo "📍 Current directory: $(pwd)"
echo "� Listing contents: $(ls -la)"

echo "�📦 Installing Python dependencies from backend..."
pip install -r backend/requirements.txt

echo "📁 Collecting static files..."
cd backend
python manage.py collectstatic --noinput --clear || echo "Static files collection failed, continuing..."

echo "✅ Build completed successfully!"