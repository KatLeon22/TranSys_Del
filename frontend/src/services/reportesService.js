const API_BASE_URL = 'http://localhost:4000/api';

class ReportesService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener reportes de rutas
    async getReportes(filtro = 'dia', fechaInicio = '', fechaFin = '') {
        try {
            console.log('=== SERVICIO: Obteniendo reportes ===');
            console.log('Parámetros enviados:', { filtro, fechaInicio, fechaFin });
            
            const params = new URLSearchParams();
            if (filtro) params.append('filtro', filtro);
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);

            const url = `${API_BASE_URL}/reportes?${params.toString()}`;
            console.log('URL completa:', url);
            console.log('Headers:', this.getAuthHeaders());

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            console.log('=== RESPUESTA HTTP ===');
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Error response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Datos recibidos del servidor:', data);
            console.log('Tipo de datos:', typeof data);
            console.log('Es array:', Array.isArray(data));
            return data;
        } catch (error) {
            console.error('❌ Error obteniendo reportes:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    // Obtener reporte por período específico
    async getReportePorPeriodo(periodo, tipo = 'dia') {
        try {
            console.log('Obteniendo reporte por período:', { periodo, tipo });
            
            const response = await fetch(`${API_BASE_URL}/reportes/periodo`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ periodo, tipo })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo reporte por período:', error);
            throw error;
        }
    }

    // Exportar reporte
    async exportarReporte(filtro, fechaInicio, fechaFin, formato = 'excel') {
        try {
            console.log('Exportando reporte:', { filtro, fechaInicio, fechaFin, formato });
            
            const params = new URLSearchParams();
            if (filtro) params.append('filtro', filtro);
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            if (formato) params.append('formato', formato);

            const response = await fetch(`${API_BASE_URL}/reportes/exportar?${params.toString()}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Para archivos, manejar la descarga
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_rutas_${new Date().toISOString().split('T')[0]}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return { success: true, message: 'Reporte exportado exitosamente' };
        } catch (error) {
            console.error('Error exportando reporte:', error);
            throw error;
        }
    }
}

export default new ReportesService();