// config.js - Archivo separado para configuración
window.CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api' 
        : '/api',
    MERCADOPAGO_PUBLIC_KEY: 'TEST-8b628a6f-0c9f-4d4f-9e6a-2d4b7a8c1d3a'
};

console.log('🎯 Configuración cargada:', window.CONFIG);