import { RutasModel } from '../models/RutasModel.js';

// Obtener el siguiente número de ruta
export const getNextRutaNumber = async (req, res) => {
    try {
        const result = await RutasModel.getNextRutaNumber();
        
        // console.log('Resultado de la consulta:', result);
        
        let nextNumber = 1;
        if (result.length > 0) {
            const lastRuta = result[0].no_ruta;
            // console.log('Última ruta encontrada:', lastRuta);
            const lastNumber = parseInt(lastRuta.substring(4)); // Extraer número después de "RUTA"
            // console.log('Último número extraído:', lastNumber);
            nextNumber = lastNumber + 1;
        }
        
        const nextRutaNumber = `RUTA${nextNumber.toString().padStart(3, '0')}`;
        
        // console.log('Siguiente número calculado:', nextRutaNumber);
        
        res.status(200).json({
            success: true,
            data: {
                nextRutaNumber,
                nextNumber
            }
        });
    } catch (error) {
        console.error('Error obteniendo siguiente número de ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todas las rutas (para administradores)
export const getAllRutas = async (req, res) => {
    try {
        const rutas = await RutasModel.getAll();
        
        res.json({
            success: true,
            data: rutas,
            count: rutas.length
        });
        
    } catch (error) {
        console.error('Error obteniendo rutas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una ruta por ID
export const getRutaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ruta = await RutasModel.getById(id);
        
        if (ruta.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: ruta[0]
        });
        
    } catch (error) {
        console.error('Error obteniendo ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nueva ruta
export const createRuta = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        
        const { 
            no_ruta, 
            cliente_id, 
            servicio, 
            mercaderia, 
            camion_id, 
            combustible, 
            origen, 
            destino, 
            chofer_id, 
            ayudante_id, 
            fecha, 
            hora, 
            precio, 
            comentario 
        } = req.body;
        
        // Validar datos requeridos
        if (!no_ruta || !cliente_id || !camion_id || !chofer_id || !fecha || !hora) {
            console.log('Datos faltantes:', {
                no_ruta: !!no_ruta,
                cliente_id: !!cliente_id,
                camion_id: !!camion_id,
                chofer_id: !!chofer_id,
                fecha: !!fecha,
                hora: !!hora
            });
            return res.status(400).json({
                success: false,
                message: 'No ruta, cliente, camión, chofer, fecha y hora son requeridos'
            });
        }
        
        // Verificar que la ruta no exista
        const rutaExistente = await RutasModel.existsByNoRuta(no_ruta);
        
        if (rutaExistente.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una ruta con este número'
            });
        }
        
        // Manejar valores nulos/undefined
        const result = await RutasModel.create(
            no_ruta, 
            cliente_id, 
            servicio || null, 
            mercaderia || null, 
            camion_id, 
            combustible || null, 
            origen || null, 
            destino || null, 
            chofer_id, 
            ayudante_id || null, 
            fecha, 
            hora, 
            precio || null, 
            comentario || null
        );
        
        // Obtener la ruta creada
        const nuevaRuta = await RutasModel.getCreatedRuta(result.insertId);
        
        res.status(201).json({
            success: true,
            message: 'Ruta creada exitosamente',
            data: nuevaRuta[0]
        });
        
    } catch (error) {
        console.error('Error creando ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar ruta
export const updateRuta = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            no_ruta, 
            cliente_id, 
            servicio, 
            mercaderia, 
            camion_id, 
            combustible, 
            origen, 
            destino, 
            chofer_id, 
            ayudante_id, 
            fecha, 
            hora, 
            precio, 
            comentario, 
            estado 
        } = req.body;
        
        // Verificar que la ruta existe
        const existeRuta = await RutasModel.exists(id);
        
        if (existeRuta.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }
        
        // Si se cambia el número de ruta, verificar que no exista otra
        if (no_ruta) {
            const rutaExistente = await RutasModel.existsByNoRutaExcludingId(no_ruta, id);
            
            if (rutaExistente.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe otra ruta con este número'
                });
            }
        }
        
        await RutasModel.update(
            id, 
            no_ruta, 
            cliente_id, 
            servicio || null, 
            mercaderia || null, 
            camion_id, 
            combustible || null, 
            origen || null, 
            destino || null, 
            chofer_id, 
            ayudante_id || null, 
            fecha, 
            hora, 
            precio || null, 
            comentario || null, 
            estado || 'Pendiente'
        );
        
        // Obtener la ruta actualizada
        const rutaActualizada = await RutasModel.getUpdatedRuta(id);
        
        res.json({
            success: true,
            message: 'Ruta actualizada exitosamente',
            data: rutaActualizada[0]
        });
        
    } catch (error) {
        console.error('Error actualizando ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar ruta
export const deleteRuta = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que la ruta existe
        const existeRuta = await RutasModel.exists(id);
        
        if (existeRuta.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        }
        
        // Eliminar historial primero
        await RutasModel.deleteHistorial(id);
        
        // Eliminar la ruta
        await RutasModel.delete(id);
        
        res.json({
            success: true,
            message: 'Ruta eliminada exitosamente'
        });
        
    } catch (error) {
        console.error('Error eliminando ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Endpoint de prueba sin autenticación
export const testRutas = async (req, res) => {
    try {
        console.log('=== TEST ENDPOINT ===');
        const rutas = await RutasModel.getAll();
        console.log('Rutas encontradas:', rutas?.length || 0);
        
        res.json({
            success: true,
            message: 'Test endpoint funcionando',
            totalRutas: rutas?.length || 0,
            rutas: rutas?.slice(0, 3) || [] // Solo las primeras 3 para prueba
        });
    } catch (error) {
        console.error('Error en test endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Error en test endpoint'
        });
    }
};

// Obtener rutas recientes para el dashboard
export const getRutasRecientes = async (req, res) => {
    try {
        // Obtener todas las rutas de la base de datos
        const rutas = await RutasModel.getAll();
        
        if (!rutas || rutas.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalRutas: 0,
                    rutasHoy: 0,
                    rutasPorFecha: []
                }
            });
        }

        // Agrupar rutas por fecha
        const rutasPorFecha = {};
        const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' });
        let rutasHoy = 0;

        console.log('🔍 Backend - Fecha de hoy calculada:', hoy);
        console.log('🔍 Backend - Fecha actual del sistema:', new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' }));

        rutas.forEach(ruta => {
            // Convertir fecha a formato YYYY-MM-DD para comparación
            const fechaRuta = new Date(ruta.fecha).toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' });
            console.log(`🔍 Ruta ${ruta.no_ruta}: fecha original=${ruta.fecha}, fecha convertida=${fechaRuta}, es hoy? ${fechaRuta === hoy}`);
            
            if (!rutasPorFecha[fechaRuta]) {
                rutasPorFecha[fechaRuta] = [];
            }
            rutasPorFecha[fechaRuta].push(ruta);
            
            if (fechaRuta === hoy) {
                rutasHoy++;
            }
        });

        // Convertir a array y ordenar por fecha descendente
        const rutasPorFechaArray = Object.keys(rutasPorFecha)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(fecha => ({
                fecha,
                cantidad: rutasPorFecha[fecha].length,
                rutas: rutasPorFecha[fecha]
            }));

        console.log('🔍 Backend - Fechas disponibles:', Object.keys(rutasPorFecha));
        console.log('🔍 Backend - Fechas ordenadas:', rutasPorFechaArray.map(grupo => grupo.fecha));
        console.log('🔍 Backend - Rutas de hoy:', rutasHoy);

        // Filtrar para mostrar solo rutas de hoy si existen, sino mostrar las más recientes
        let rutasParaMostrar = [];
        let fechaParaMostrar = hoy;
        
        if (rutasPorFecha[hoy] && rutasPorFecha[hoy].length > 0) {
            // Hay rutas para hoy
            rutasParaMostrar = rutasPorFecha[hoy];
            fechaParaMostrar = hoy;
            console.log('✅ Mostrando rutas de hoy:', rutasParaMostrar.length);
        } else {
            // No hay rutas para hoy, mostrar las más recientes
            if (rutasPorFechaArray.length > 0) {
                rutasParaMostrar = rutasPorFechaArray[0].rutas;
                fechaParaMostrar = rutasPorFechaArray[0].fecha;
                console.log('⚠️ No hay rutas para hoy, mostrando las más recientes del:', fechaParaMostrar);
            }
        }

        const estadisticas = {
            totalRutas: rutas.length,
            rutasHoy,
            rutasPorFecha: [{
                fecha: fechaParaMostrar,
                cantidad: rutasParaMostrar.length,
                rutas: rutasParaMostrar
            }]
        };
        
        res.status(200).json({
            success: true,
            data: estadisticas
        });
        
    } catch (error) {
        console.error('Error obteniendo rutas recientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};