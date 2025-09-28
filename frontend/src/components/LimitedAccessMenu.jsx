import React from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/authService.js';

const LimitedAccessMenu = () => {
  const user = authService.getCurrentUser();
  const permissions = authService.getPermissions();

  if (!user || !permissions) return null;

  const hasReportes = permissions.some(p => p.nombre_permiso === 'generar_reportes');
  const hasRutas = permissions.some(p => p.nombre_permiso === 'ver_rutas');
  const hasGestion = permissions.some(p => p.nombre_permiso === 'gestionar_catalogos');
  const isAdmin = user.rol_nombre === 'administrador';

  // Si es administrador, no mostrar este menú
  if (isAdmin) return null;

  // Si tiene múltiples permisos, no mostrar este menú
  if ((hasReportes ? 1 : 0) + (hasRutas ? 1 : 0) + (hasGestion ? 1 : 0) > 1) return null;

  const getAvailableOptions = () => {
    const options = [];

    if (hasReportes) {
      options.push({
        to: '/reportes',
        label: '📊 Reportes',
        description: 'Generar y visualizar reportes del sistema',
        color: '#059669'
      });
    }

    if (hasRutas) {
      options.push({
        to: '/rutas',
        label: '🛣️ Rutas',
        description: 'Gestionar rutas del sistema',
        color: '#2563eb'
      });
    }

    if (hasGestion) {
      options.push({
        to: '/usuarios',
        label: '👥 Usuarios',
        description: 'Gestionar usuarios del sistema',
        color: '#7c3aed'
      });
    }

    if (user.rol_nombre === 'piloto') {
      options.push({
        to: '/piloto-rutas',
        label: '✈️ Mis Rutas',
        description: 'Ver y gestionar mis rutas asignadas',
        color: '#dc2626'
      });
    }

    return options;
  };

  const availableOptions = getAvailableOptions();

  if (availableOptions.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <h3 style={{
        color: '#374151',
        fontSize: '1.2rem',
        marginBottom: '15px',
        fontWeight: '600'
      }}>
        Secciones Disponibles
      </h3>
      
      <p style={{
        color: '#6b7280',
        fontSize: '0.9rem',
        marginBottom: '20px'
      }}>
        Según tus permisos, puedes acceder a las siguientes secciones:
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center'
      }}>
        {availableOptions.map((option, index) => (
          <NavLink
            key={index}
            to={option.to}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '300px',
              padding: '15px 20px',
              backgroundColor: 'white',
              border: `2px solid ${option.color}30`,
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.target.style.borderColor = option.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.target.style.borderColor = `${option.color}30`;
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '8px'
            }}>
              {option.label}
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              {option.description}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default LimitedAccessMenu;
