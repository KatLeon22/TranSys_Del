import { executeQuery } from '../config/db.js';

export class ReportesModel {
    // Obtener reportes de rutas con filtros
    static async getReportes(filtro = 'dia', fechaInicio, fechaFin) {
        let groupBy = '';
        let dateFormat = '';

        // Configurar formato de fecha según el filtro
        switch (filtro) {
            case 'dia':
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(r.fecha)';
                break;
            case 'mes':
                dateFormat = '%Y-%m';
                groupBy = 'DATE_FORMAT(r.fecha, "%Y-%m")';
                break;
            case 'año':
                dateFormat = '%Y';
                groupBy = 'YEAR(r.fecha)';
                break;
            default:
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(r.fecha)';
        }

        // Construir la consulta base
        let query = `
            SELECT 
                ${groupBy} as periodo,
                COUNT(r.id) as total_rutas,
                COALESCE(SUM(CASE WHEN r.estado = 'Pendiente' THEN 1 ELSE 0 END), 0) as rutas_pendientes,
                COALESCE(SUM(CASE WHEN r.estado = 'En curso' THEN 1 ELSE 0 END), 0) as rutas_en_curso,
                COALESCE(SUM(CASE WHEN r.estado = 'Entregado' THEN 1 ELSE 0 END), 0) as rutas_entregadas,
                COALESCE(SUM(CASE WHEN r.estado = 'Incidente' THEN 1 ELSE 0 END), 0) as rutas_incidentes,
                COALESCE(SUM(CASE WHEN r.estado = 'Entregado' THEN r.precio ELSE 0 END), 0) as ingresos_totales
            FROM rutas r
            WHERE 1=1
        `;

        const params = [];

        // Agregar filtros de fecha si se proporcionan
        if (fechaInicio) {
            query += ' AND r.fecha >= ?';
            params.push(fechaInicio);
        }

        if (fechaFin) {
            query += ' AND r.fecha <= ?';
            params.push(fechaFin);
        }

        query += ` GROUP BY ${groupBy} ORDER BY periodo DESC`;

        return await executeQuery(query, params);
    }

    // Obtener reporte por período específico
    static async getReportePorPeriodo(periodo, tipo = 'dia') {
        let query = '';

        switch (tipo) {
            case 'dia':
                query = `
                    SELECT 
                        r.*,
                        c.nombre as cliente_nombre,
                        p.nombre as chofer_nombre,
                        a.nombre as ayudante_nombre,
                        cam.placa as camion_placa
                    FROM rutas r
                    LEFT JOIN clientes c ON r.cliente_id = c.id
                    LEFT JOIN pilotos p ON r.chofer_id = p.id
                    LEFT JOIN ayudantes a ON r.ayudante_id = a.id
                    LEFT JOIN camiones cam ON r.camion_id = cam.id
                    WHERE DATE(r.fecha) = ?
                    ORDER BY r.fecha DESC
                `;
                break;
            case 'mes':
                query = `
                    SELECT 
                        r.*,
                        c.nombre as cliente_nombre,
                        p.nombre as chofer_nombre,
                        a.nombre as ayudante_nombre,
                        cam.placa as camion_placa
                    FROM rutas r
                    LEFT JOIN clientes c ON r.cliente_id = c.id
                    LEFT JOIN pilotos p ON r.chofer_id = p.id
                    LEFT JOIN ayudantes a ON r.ayudante_id = a.id
                    LEFT JOIN camiones cam ON r.camion_id = cam.id
                    WHERE DATE_FORMAT(r.fecha, '%Y-%m') = ?
                    ORDER BY r.fecha DESC
                `;
                break;
            case 'año':
                query = `
                    SELECT 
                        r.*,
                        c.nombre as cliente_nombre,
                        p.nombre as chofer_nombre,
                        a.nombre as ayudante_nombre,
                        cam.placa as camion_placa
                    FROM rutas r
                    LEFT JOIN clientes c ON r.cliente_id = c.id
                    LEFT JOIN pilotos p ON r.chofer_id = p.id
                    LEFT JOIN ayudantes a ON r.ayudante_id = a.id
                    LEFT JOIN camiones cam ON r.camion_id = cam.id
                    WHERE YEAR(r.fecha) = ?
                    ORDER BY r.fecha DESC
                `;
                break;
        }

        return await executeQuery(query, [periodo]);
    }

    // Función auxiliar para formatear el período
    static formatearPeriodo(periodo, filtro) {
        if (!periodo) return 'N/A';
        
        switch (filtro) {
            case 'dia':
                return new Date(periodo).toLocaleDateString('es-ES');
            case 'mes':
                const [año, mes] = periodo.split('-');
                const meses = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                return `${meses[parseInt(mes) - 1]} ${año}`;
            case 'año':
                return `Año ${periodo}`;
            default:
                return periodo;
        }
    }
}



