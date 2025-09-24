import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService.js';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay token y usuario en localStorage
        if (authService.isAuthenticated()) {
          // Verificar token con el servidor
          const result = await authService.verifyToken();
          
          if (result.success) {
            setIsAuthenticated(true);
            
            // Verificar rol si es requerido
            if (requiredRole) {
              const user = authService.getCurrentUser();
              if (user.rol_nombre === requiredRole) {
                setHasAccess(true);
              } else {
                setHasAccess(false);
              }
            } else {
              setHasAccess(true);
            }
            
            // Verificar permiso si es requerido
            if (requiredPermission && hasAccess) {
              if (authService.hasPermission(requiredPermission)) {
                setHasAccess(true);
              } else {
                setHasAccess(false);
              }
            }
          } else {
            // Token inválido, limpiar datos
            authService.logout();
            setIsAuthenticated(false);
            setHasAccess(false);
          }
        } else {
          setIsAuthenticated(false);
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(false);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, requiredPermission]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Verificando autenticación...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login con la ruta actual como state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        textAlign: 'center'
      }}>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

