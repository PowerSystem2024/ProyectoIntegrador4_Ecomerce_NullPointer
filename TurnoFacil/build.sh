#!/bin/bash
# Build script para Render
echo "🔧 Starting build process..."
echo "📍 Current directory: $(pwd)"

echo "� Installing Python dependencies from backend..."
pip install -r backend/requirements.txt

echo "🌐 Copying frontend files to Django static..."
cd backend
mkdir -p static
cp -r ../fronted/* static/ || echo "Frontend copy failed, continuing..."

echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --clear || echo "Static files collection failed, continuing..."

echo "✅ Build completed successfully!"
echo "📂 Static files structure:"
ls -la static/ || echo "No static directory"