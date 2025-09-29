import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import "../styles/reportes.css";
import rutasService from "../services/rutasService.js";

// Importar íconos de react-icons
import { FaTruck, FaClock, FaExclamationTriangle, FaMoneyBillWave } from "react-icons/fa";

export default function Dashboard() {
  const [rutasHoy, setRutasHoy] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      cargarDatos();
    } else {
      console.log('Usuario no autenticado, redirigiendo al login');
      // Redirigir al login si no hay token
      window.location.href = '/login';
    }
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del servicio
      const response = await rutasService.getRutasRecientes();
      console.log('📊 Respuesta completa del servidor:', response);
      
      // Guardar datos completos
      setData(response);
      
      // Obtener solo las rutas de hoy
      const hoy = new Date().toISOString().split('T')[0];
      console.log('📅 Buscando rutas para la fecha:', hoy);
      console.log('📋 Fechas disponibles:', response?.data?.rutasPorFecha?.map(grupo => grupo.fecha));
      
      // Buscar rutas de hoy
      const rutasHoyData = response?.data?.rutasPorFecha?.find(grupo => grupo.fecha === hoy);
      
      if (rutasHoyData && rutasHoyData.rutas.length > 0) {
        console.log('✅ Rutas encontradas para hoy:', rutasHoyData.rutas.length);
        setRutasHoy(rutasHoyData.rutas);
      } else {
        console.log('⚠️ No se encontraron rutas para hoy');
        console.log('📋 Mostrando todas las fechas disponibles:', response?.data?.rutasPorFecha);
        setRutasHoy([]);
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return '#facc15';
      case 'En curso': return '#2563eb';
      case 'Entregado': return '#16a34a';
      case 'Incidente': return '#dc2626';
      default: return '#6b7280';
    }
  };


  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div style={{ marginBottom: '20px' }}>
        <h2>Resumen del día</h2>
      </div>
      
      {/* Tarjetas de estadísticas con iconos */}
      <div className="dashboard-cards">
        <div className="card" style={{ borderTop: '5px solid #2563eb' }}>
          <div className="card-icon" style={{ color: '#2563eb' }}>
            <FaTruck />
          </div>
          <h3>Total de Rutas</h3>
          <p>{rutasHoy.length}</p>
        </div>
        
        <div className="card" style={{ borderTop: '5px solid #facc15' }}>
          <div className="card-icon" style={{ color: '#facc15' }}>
            <FaClock />
          </div>
          <h3>Rutas Pendientes</h3>
          <p>{rutasHoy.filter(ruta => ruta.estado === 'Pendiente').length}</p>
        </div>
        
        <div className="card" style={{ borderTop: '5px solid #2563eb' }}>
          <div className="card-icon" style={{ color: '#2563eb' }}>
            <FaTruck />
          </div>
          <h3>Rutas En Curso</h3>
          <p>{rutasHoy.filter(ruta => ruta.estado === 'En curso').length}</p>
        </div>
        
        <div className="card" style={{ borderTop: '5px solid #16a34a' }}>
          <div className="card-icon" style={{ color: '#16a34a' }}>
            <FaClock />
          </div>
          <h3>Rutas Entregadas</h3>
          <p>{rutasHoy.filter(ruta => ruta.estado === 'Entregado').length}</p>
        </div>
        
        <div className="card" style={{ borderTop: '5px solid #dc2626' }}>
          <div className="card-icon" style={{ color: '#dc2626' }}>
            <FaExclamationTriangle />
          </div>
          <h3>Rutas con Incidentes</h3>
          <p>{rutasHoy.filter(ruta => ruta.estado === 'Incidente').length}</p>
        </div>
        
        <div className="card" style={{ borderTop: '5px solid #f59e0b' }}>
          <div className="card-icon" style={{ color: '#f59e0b' }}>
            <FaMoneyBillWave />
          </div>
          <h3>Ingresos Totales</h3>
          <p>Q{rutasHoy.reduce((total, ruta) => total + (parseFloat(ruta.precio) || 0), 0).toFixed(2)}</p>
        </div>
      </div>


      {/* Tabla de viajes de hoy */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3>Viajes de Hoy - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#6b7280', 
              margin: '4px 0 0 0',
              fontStyle: 'italic'
            }}>
              {rutasHoy.length} viaje{rutasHoy.length !== 1 ? 's' : ''} programado{rutasHoy.length !== 1 ? 's' : ''} para hoy
            </p>
          </div>
          
          <button 
            onClick={cargarDatos}
            style={{
              padding: '8px 16px',
              backgroundColor: '#103053',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🔄 Actualizar
          </button>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : rutasHoy.length > 0 ? (
          <div className="rutas-tabla">
            <table>
              <thead>
                <tr>
                  <th>No. Ruta</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Piloto</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {rutasHoy.map((ruta, index) => (
                  <tr key={index}>
                    <td>{ruta.no_ruta}</td>
                    <td>
                      <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontWeight: '600' }}>{ruta.cliente_nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{ruta.cliente_apellido}</div>
                      </div>
                    </td>
                    <td>{ruta.servicio || '-'}</td>
                    <td>{ruta.origen || '-'}</td>
                    <td>{ruta.destino || '-'}</td>
                    <td>
                      <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontWeight: '600' }}>{ruta.piloto_nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{ruta.piloto_apellido}</div>
                      </div>
                    </td>
                    <td>{ruta.hora || '-'}</td>
                    <td>
                      <span 
                        className="estado-badge"
                        style={{ backgroundColor: obtenerColorEstado(ruta.estado) }}
                      >
                        {ruta.estado}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', textAlign: 'center' }}>
                      Q{ruta.precio || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sin-datos">
            <p>No hay viajes programados para hoy</p>
            <p>Los viajes aparecerán aquí cuando se asignen para el día actual</p>
          </div>
        )}
      </div>
    </div>
  );
}
