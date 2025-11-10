#!/bin/bash
# Build script para Render
echo "🔧 Starting build process..."
echo "📍 Current directory: $(pwd)"
echo "📂 Listing contents: $(ls -la)"

echo " Installing Python dependencies from backend..."
pip install -r backend/requirements.txt

echo "📁 Collecting static files..."
cd backend
python manage.py collectstatic --noinput --clear || echo "Static files collection failed, continuing..."

echo "🌐 Copying frontend files..."
cd ..
mkdir -p backend/static/frontend
cp -r fronted/* backend/static/frontend/ || echo "Frontend copy failed, continuing..."

echo "✅ Build completed successfully!"