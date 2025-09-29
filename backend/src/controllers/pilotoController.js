import { PilotoModel } from '../models/PilotoModel.js';

// =========================
// CONTROLADOR PILOTO - SOLO LÓGICA DE NEGOCIO
// =========================

// Obtener todos los pilotos (para asignación de usuarios)
export const getAllPilotos = async (req, res) => {
    try {
        const pilotos = await PilotoModel.getAllPilotos();
        
        res.json({
            success: true,
            data: pilotos
        });
    } catch (error) {
        console.error('Error obteniendo pilotos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Debug: Obtener información del usuario piloto
export const getPilotoInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const pilotoId = req.user?.piloto_id;
        
        console.log('🔍 Debug - Usuario ID:', userId);
        console.log('🔍 Debug - Piloto ID:', pilotoId);
        console.log('🔍 Debug - Usuario completo:', req.user);
        
        // Obtener información detallada del usuario
        const userInfo = await PilotoModel.getUserInfo(userId);
        
        res.json({
            success: true,
            data: {
                user: req.user,
                userInfo: userInfo,
                fecha_actual: new Date().toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error('Error obteniendo info del piloto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Debug completo: Verificar todo el flujo del piloto
export const debugPilotoCompleto = async (req, res) => {
    try {
        const userId = req.user?.id;
        const pilotoId = req.user?.piloto_id;
        const fechaActual = new Date().toISOString().split('T')[0];
        
        console.log('🔍 DEBUG COMPLETO - Usuario ID:', userId);
        console.log('🔍 DEBUG COMPLETO - Piloto ID:', pilotoId);
        console.log('🔍 DEBUG COMPLETO - Fecha actual:', fechaActual);
        
        // 1. Verificar información del usuario
        const userInfo = await PilotoModel.getUserInfo(userId);
        console.log('👤 Información del usuario:', userInfo);
        
        // 2. Verificar si hay rutas asignadas al piloto (todas las fechas)
        const todasLasRutas = await PilotoModel.getRutasByPiloto(userId);
        console.log('📊 Total rutas del piloto (todas las fechas):', todasLasRutas.length);
        
        // 3. Verificar rutas para la fecha actual
        const rutasHoy = await PilotoModel.getRutasByPilotoAndDate(pilotoId, fechaActual);
        console.log('📅 Rutas para hoy:', rutasHoy.length);
        
        // 4. Verificar si hay rutas en la tabla rutas para este piloto
        const rutasEnBD = await PilotoModel.verificarRutasEnBD(pilotoId);
        console.log('🗄️ Rutas en BD para piloto_id:', pilotoId, ':', rutasEnBD.length);
        
        res.json({
            success: true,
            debug: {
                usuario: {
                    id: userId,
                    username: req.user.username,
                    rol: req.user.rol_nombre,
                    piloto_id: pilotoId
                },
                userInfo: userInfo,
                fechas: {
                    actual: fechaActual,
                    formato: 'YYYY-MM-DD'
                },
                rutas: {
                    total_asignadas: todasLasRutas.length,
                    para_hoy: rutasHoy.length,
                    en_bd: rutasEnBD.length
                },
                datos_completos: {
                    todas_las_rutas: todasLasRutas,
                    rutas_hoy: rutasHoy,
                    rutas_en_bd: rutasEnBD
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Error en debug completo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Debug de autenticación: Verificar si el usuario está autenticado correctamente
export const debugAuth = async (req, res) => {
    try {
        console.log('🔐 DEBUG AUTH - Headers:', req.headers);
        console.log('🔐 DEBUG AUTH - User object:', req.user);
        
        res.json({
            success: true,
            debug: {
                headers: {
                    authorization: req.headers.authorization ? 'Presente' : 'Ausente',
                    content_type: req.headers['content-type'],
                    user_agent: req.headers['user-agent']
                },
                user: req.user || 'No autenticado',
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('❌ Error en debug auth:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Debug de permisos: Verificar permisos del usuario
export const debugPermissions = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }
        
        // Obtener permisos del usuario
        const permisos = await PilotoModel.getUserPermissions(userId);
        
        res.json({
            success: true,
            debug: {
                usuario: {
                    id: userId,
                    username: req.user.username,
                    rol: req.user.rol_nombre
                },
                permisos: permisos,
                count: permisos.length
            }
        });
        
    } catch (error) {
        console.error('❌ Error en debug permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener rutas de un piloto específico
export const getRutasByPiloto = async (req, res) => {
    try {
        const userId = req.user?.id; // ID del usuario logueado
        
        console.log('🔍 Obteniendo rutas para usuario ID:', userId);
        
        // Obtener fecha actual
        const hoy = new Date().toISOString().split('T')[0];
        console.log('📅 Fecha actual:', hoy);
        
        // Obtener rutas usando el modelo (que maneja la obtención del piloto_id)
        const rutas = await PilotoModel.getRutasByPiloto(userId);
        
        console.log('📊 Total rutas del piloto:', rutas.length);
        console.log('📊 Fechas de rutas encontradas:', rutas.map(r => r.fecha));
        
        // Filtrar por fecha actual (comparar solo la parte de fecha, no la hora)
        const rutasHoy = rutas.filter(ruta => {
            const fechaRuta = new Date(ruta.fecha).toISOString().split('T')[0];
            console.log(`🔍 Comparando: ${fechaRuta} === ${hoy} ? ${fechaRuta === hoy}`);
            return fechaRuta === hoy;
        });
        
        console.log('📊 Rutas para hoy:', rutasHoy.length);
        console.log('📊 Rutas filtradas para hoy:', rutasHoy.map(ruta => ({ id: ruta.id, no_ruta: ruta.no_ruta, fecha: ruta.fecha })));
        
        res.json({
            success: true,
            data: rutasHoy,
            count: rutasHoy.length,
            fecha: hoy
        });
        
    } catch (error) {
        console.error('❌ Error obteniendo rutas del piloto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar estado de una ruta (solo pilotos)
export const updateEstadoRuta = async (req, res) => {
    try {
        const { rutaId } = req.params;
        const { nuevoEstado, comentario } = req.body;
        const pilotoId = req.user.id;
        
        // Verificar que la ruta pertenece al piloto
        const ruta = await PilotoModel.verificarRutaPiloto(rutaId, pilotoId);
        
        if (ruta.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar esta ruta'
            });
        }
        
        const estadoAnterior = ruta[0].estado_actual;
        
        // Actualizar el estado de la ruta
        await PilotoModel.updateEstadoRuta(rutaId, nuevoEstado, comentario);
        
        // Registrar en el historial
        await PilotoModel.registrarHistorial(rutaId, pilotoId, estadoAnterior, nuevoEstado, comentario);
        
        res.json({
            success: true,
            message: 'Estado actualizado correctamente',
            data: {
                rutaId,
                estadoAnterior,
                nuevoEstado,
                comentario
            }
        });
        
    } catch (error) {
        console.error('Error actualizando estado de ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener historial de una ruta específica
export const getHistorialRuta = async (req, res) => {
    try {
        const { rutaId } = req.params;
        const pilotoId = req.user.id;
        
        // Verificar que la ruta pertenece al piloto
        const ruta = await PilotoModel.verificarRutaPiloto(rutaId, pilotoId);
        
        if (ruta.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta ruta'
            });
        }
        
        // Obtener historial
        const historial = await PilotoModel.getHistorialRuta(rutaId);
        
        res.json({
            success: true,
            data: historial
        });
        
    } catch (error) {
        console.error('Error obteniendo historial de ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
