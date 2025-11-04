// Este archivo contiene funcionalidades adicionales para PDF
// Las principales funciones ya están incluidas en pagos.js

class PDFUtils {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatTime(timeString) {
        return timeString;
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    }
}

// Funciones globales de utilidad para PDF
window.PDFUtils = PDFUtils;