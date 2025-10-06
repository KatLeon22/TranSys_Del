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
  const [fechaActual, setFechaActual] = useState(new Date());

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

  // Actualizar fecha cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setFechaActual(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  // Recargar datos cuando cambie la fecha
  useEffect(() => {
    if (data) {
      cargarDatos();
    }
  }, [fechaActual]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del servicio
      const response = await rutasService.getRutasRecientes();
      console.log('📊 Respuesta completa del servidor:', response);
      
      // Guardar datos completos
      setData(response);
      
      // Obtener rutas de la fecha más reciente disponible (usando zona horaria de Guatemala)
      const hoy = fechaActual.toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' }); // Formato YYYY-MM-DD en zona horaria de Guatemala
      console.log('📅 Buscando rutas para la fecha:', hoy);
      console.log('📅 Fecha actual del sistema:', new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' }));
      console.log('📋 Fechas disponibles:', response?.data?.rutasPorFecha?.map(grupo => grupo.fecha));
      
      // El backend ahora devuelve solo las rutas relevantes (de hoy o las más recientes)
      let rutasHoyData = response?.data?.rutasPorFecha?.[0]; // El backend ya filtra correctamente
      
      if (rutasHoyData) {
        const esHoy = rutasHoyData.fecha === hoy;
        console.log(`📅 Mostrando rutas del ${rutasHoyData.fecha} (${esHoy ? 'HOY' : 'FECHA MÁS RECIENTE'})`);
      }
      
      if (rutasHoyData && rutasHoyData.rutas.length > 0) {
        console.log('✅ Rutas encontradas:', rutasHoyData.rutas.length);
        setRutasHoy(rutasHoyData.rutas);
      } else {
        console.log('⚠️ No hay rutas programadas para hoy');
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
            <h3>Viajes {data?.data?.rutasPorFecha?.[0]?.fecha === fechaActual.toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' }) ? 'de Hoy' : 'Recientes'} - {fechaActual.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              timeZone: 'America/Guatemala'
            })}</h3>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#6b7280', 
              margin: '4px 0 0 0',
              fontStyle: 'italic'
            }}>
              {rutasHoy.length} viaje{rutasHoy.length !== 1 ? 's' : ''} programado{rutasHoy.length !== 1 ? 's' : ''} {data?.data?.rutasPorFecha?.[0]?.fecha === fechaActual.toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' }) ? 'para hoy' : 'para esta fecha'}
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#10b981', 
                marginLeft: '8px',
                fontWeight: '500'
              }}>
                🔄 Actualización automática
              </span>
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
            <p>📅 No hay viajes programados para hoy</p>
            <p>Los viajes aparecerán aquí cuando se asignen para el día actual</p>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '10px' }}>
              💡 <strong>Tip:</strong> Ve a la sección "Rutas" para crear nuevos viajes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
