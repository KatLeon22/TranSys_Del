import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '20px'
      }}>
        🚫
      </div>
      
      <h1 style={{
        color: '#dc2626',
        fontSize: '2rem',
        marginBottom: '10px'
      }}>
        Acceso Denegado
      </h1>
      
      <p style={{
        color: '#6b7280',
        fontSize: '1.1rem',
        marginBottom: '30px',
        maxWidth: '500px'
      }}>
        No tienes permisos para acceder a esta sección. 
        Solo los administradores pueden ver el dashboard.
      </p>
      
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link 
          to="/rutas" 
          style={{
            backgroundColor: '#103053',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          Ver Rutas
        </Link>
        
        <Link 
          to="/piloto-rutas" 
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          Mis Rutas
        </Link>
      </div>
      
      <p style={{
        color: '#9ca3af',
        fontSize: '0.9rem',
        marginTop: '30px'
      }}>
        Si crees que esto es un error, contacta al administrador del sistema.
      </p>
    </div>
  );
};

export default AccessDenied;
