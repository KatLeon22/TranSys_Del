import { ReportesModel } from '../models/ReportesModel.js';

// Obtener reportes de rutas
export const getReportes = async (req, res) => {
    try {
        const { filtro = 'dia', fechaInicio, fechaFin } = req.query;
        
        console.log('Generando reportes:', { filtro, fechaInicio, fechaFin });

        const reportes = await ReportesModel.getReportes(filtro, fechaInicio, fechaFin);
        console.log('📊 Resultados de la consulta:', reportes);
        
        // Debug detallado de cada resultado
        if (reportes && reportes.length > 0) {
            reportes.forEach((row, index) => {
                console.log(`📊 Resultado ${index + 1}:`, {
                    periodo: row.periodo,
                    total_rutas: row.total_rutas,
                    rutas_pendientes: row.rutas_pendientes,
                    rutas_en_curso: row.rutas_en_curso,
                    rutas_entregadas: row.rutas_entregadas,
                    rutas_incidentes: row.rutas_incidentes,
                    ingresos_totales: row.ingresos_totales
                });
            });
        } else {
            console.log('⚠️ No se encontraron resultados para la consulta');
        }
        
        // Formatear los datos para el frontend
        const reportesFormateados = reportes.map(reporte => ({
            periodo: ReportesModel.formatearPeriodo(reporte.periodo, filtro),
            total_rutas: parseInt(reporte.total_rutas),
            rutas_pendientes: parseInt(reporte.rutas_pendientes || 0),
            rutas_en_curso: parseInt(reporte.rutas_en_curso || 0),
            rutas_entregadas: parseInt(reporte.rutas_entregadas || 0),
            rutas_incidentes: parseInt(reporte.rutas_incidentes || 0),
            ingresos_totales: parseFloat(reporte.ingresos_totales || 0)
        }));

        res.json({
            success: true,
            data: reportesFormateados,
            count: reportesFormateados.length,
            filtro: filtro,
            fechaInicio: fechaInicio || null,
            fechaFin: fechaFin || null
        });
        
    } catch (error) {
        console.error('Error obteniendo reportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener reporte por período específico
export const getReportePorPeriodo = async (req, res) => {
    try {
        const { periodo, tipo = 'dia' } = req.body;
        
        const rutas = await ReportesModel.getReportePorPeriodo(periodo, tipo);
        
        res.json({
            success: true,
            data: rutas,
            count: rutas.length,
            periodo: periodo,
            tipo: tipo
        });
        
    } catch (error) {
        console.error('Error obteniendo reporte por período:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Exportar reporte
export const exportarReporte = async (req, res) => {
    try {
        const { filtro = 'dia', fechaInicio, fechaFin, formato = 'excel' } = req.query;
        
        // Por ahora, devolver los datos en JSON
        // En el futuro se puede implementar generación de Excel/PDF
        const reportes = await getReportes(req, res);
        
        res.json({
            success: true,
            message: 'Función de exportación pendiente de implementar',
            data: reportes
        });
        
    } catch (error) {
        console.error('Error exportando reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

