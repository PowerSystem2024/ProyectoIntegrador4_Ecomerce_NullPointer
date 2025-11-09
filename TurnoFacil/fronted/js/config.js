// config.js - Archivo separado para configuración
window.CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api' 
        : '/api',
    MERCADOPAGO_PUBLIC_KEY: 'APP_USR-aaf87840-bb69-4343-8b1e-f8a49c92a770'
};

console.log('🎯 Configuración cargada:', window.CONFIG);