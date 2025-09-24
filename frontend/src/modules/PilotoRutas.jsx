import React, { useState, useEffect } from 'react';
import authService from '../services/authService.js';
import pilotoService from '../services/pilotoService.js';
import '../styles/piloto-rutas.css';

export default function PilotoRutas() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentario, setComentario] = useState('');

  const user = authService.getCurrentUser();

  // Estados disponibles para pilotos
  const estadosDisponibles = [
    { value: 'Pendiente', label: 'Pendiente', color: '#ffc107' },
    { value: 'En curso', label: 'En curso', color: '#007bff' },
    { value: 'Entregado', label: 'Entregado', color: '#28a745' },
    { value: 'Incidente', label: 'Incidente', color: '#dc3545' }
  ];

  // Cargar rutas del piloto
  useEffect(() => {
    cargarRutas();
  }, []);

  const cargarRutas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await pilotoService.getMisRutas();
      
      if (response.success) {
        setRutas(response.data);
      } else {
        setError(response.message || 'Error al cargar las rutas');
      }
    } catch (error) {
      setError('Error al cargar las rutas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (ruta) => {
    setSelectedRuta(ruta);
    setNuevoEstado(ruta.estado);
    setComentario(ruta.comentario || '');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedRuta(null);
    setNuevoEstado('');
    setComentario('');
  };

  const cambiarEstado = async () => {
    try {
      const response = await pilotoService.updateEstadoRuta(
        selectedRuta.id, 
        nuevoEstado, 
        comentario
      );

      if (response.success) {
        // Actualizar localmente
        setRutas(rutas.map(ruta => 
          ruta.id === selectedRuta.id 
            ? { ...ruta, estado: nuevoEstado, comentario }
            : ruta
        ));

        cerrarModal();
        alert('Estado actualizado correctamente');
      } else {
        setError(response.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      setError('Error al actualizar el estado');
      console.error('Error:', error);
    }
  };

  const getEstadoColor = (estado) => {
    const estadoObj = estadosDisponibles.find(e => e.value === estado);
    return estadoObj ? estadoObj.color : '#6c757d';
  };

  if (loading) {
    return (
      <div className="piloto-rutas-container">
        <div className="loading">Cargando rutas...</div>
      </div>
    );
  }

  return (
    <div className="piloto-rutas-container">
      <div className="piloto-header">
        <h1>Mis Rutas - {user?.username}</h1>
        <p>Gestiona el estado de tus rutas asignadas</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {rutas.length === 0 ? (
        <div className="no-rutas">
          <div className="no-rutas-content">
            <h3>🚛 No tienes rutas asignadas</h3>
            <p>Contacta al administrador para que te asigne rutas.</p>
          </div>
        </div>
      ) : (
        <div className="rutas-grid">
          {rutas.map(ruta => (
          <div key={ruta.id} className="ruta-card">
            <div className="ruta-header">
              <h3>{ruta.no_ruta}</h3>
              <span 
                className="estado-badge"
                style={{ backgroundColor: getEstadoColor(ruta.estado) }}
              >
                {ruta.estado}
              </span>
            </div>
            
            <div className="ruta-info">
              <p><strong>Cliente:</strong> {ruta.cliente_nombre} {ruta.cliente_apellido}</p>
              <p><strong>Servicio:</strong> {ruta.servicio}</p>
              <p><strong>Origen:</strong> {ruta.origen}</p>
              <p><strong>Destino:</strong> {ruta.destino}</p>
              <p><strong>Fecha:</strong> {ruta.fecha}</p>
              <p><strong>Hora:</strong> {ruta.hora}</p>
              <p><strong>Camion:</strong> {ruta.camion_placa} ({ruta.camion_marca} {ruta.camion_modelo})</p>
              {ruta.ayudante_nombre && (
                <p><strong>Ayudante:</strong> {ruta.ayudante_nombre} {ruta.ayudante_apellido}</p>
              )}
              {ruta.comentario && (
                <p><strong>Comentario:</strong> {ruta.comentario}</p>
              )}
            </div>

            <button 
              className="btn-cambiar-estado"
              onClick={() => abrirModal(ruta)}
            >
              Cambiar Estado
            </button>
          </div>
          ))}
        </div>
      )}

      {/* Modal para cambiar estado */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cambiar Estado - {selectedRuta?.no_ruta}</h3>
            
            <div className="form-group">
              <label>Nuevo Estado:</label>
              <select 
                value={nuevoEstado} 
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="estado-select"
              >
                {estadosDisponibles.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Comentario (opcional):</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agrega un comentario sobre el cambio de estado..."
                rows="3"
                className="comentario-textarea"
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancelar"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar"
                onClick={cambiarEstado}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
