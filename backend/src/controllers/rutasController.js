import { RutasModel } from '../models/RutasModel.js';

// Obtener el siguiente número de ruta
export const getNextRutaNumber = async (req, res) => {
    try {
        const result = await RutasModel.getNextRutaNumber();
        
        let nextNumber = 1;
        if (result.length > 0) {
            const lastRuta = result[0].no_ruta;
            const lastNumber = parseInt(lastRuta.substring(4)); // Extraer número después de "RUTA"
            nextNumber = lastNumber + 1;
        }
        
        const nextRutaNumber = `RUTA${nextNumber.toString().padStart(3, '0')}`;
        
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
        
        const result = await RutasModel.create(
            no_ruta, cliente_id, servicio, mercaderia, camion_id, 
            combustible, origen, destino, chofer_id, ayudante_id, 
            fecha, hora, precio, comentario
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
            id, no_ruta, cliente_id, servicio, mercaderia, 
            camion_id, combustible, origen, destino, chofer_id, 
            ayudante_id, fecha, hora, precio, comentario, estado
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