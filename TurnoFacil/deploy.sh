#!/bin/bash

echo "🚀 Iniciando deploy de Turno Fácil..."
echo "==========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
BACKEND_PID=""
FRONTEND_PID=""

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servidores...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}✅ Servidores detenidos.${NC}"
    exit 0
}

# Capturar señales de interrupción
trap cleanup INT TERM

# Verificar que estamos en el directorio correcto
if [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Error: Directorios backend o frontend no encontrados${NC}"
    echo "Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Verificar Python
if ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python no encontrado. Por favor instala Python 3.8+${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Instalando dependencias del backend...${NC}"
cd $BACKEND_DIR

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}🔄 Creando entorno virtual...${NC}"
    python -m venv venv
fi

# Activar entorno virtual
source venv/bin/activate

pip install -r requirements.txt

echo -e "${BLUE}🗄 Configurando base de datos...${NC}"

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creando archivo .env desde .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠  Por favor, configura las variables en backend/.env${NC}"
fi

python manage.py migrate
python manage.py collectstatic --noinput

echo -e "${BLUE}🌐 Iniciando servidor backend...${NC}"
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 3

cd ../$FRONTEND_DIR

echo -e "${BLUE}🚀 Iniciando servidor frontend...${NC}"
python -m http.server 3000 &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ ¡Deploy completado!${NC}"
echo "==========================================="
echo -e "${BLUE}📊 Backend:${NC}  http://localhost:8000"
echo -e "${BLUE}🎨 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}⚙  Admin:${NC}    http://localhost:8000/admin"
echo ""
echo -e "${YELLOW}💡 Para detener los servidores, presiona Ctrl+C${NC}"
echo "==========================================="

# Esperar hasta que el usuario presione Ctrl+C
wait