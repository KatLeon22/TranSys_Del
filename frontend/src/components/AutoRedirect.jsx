import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService.js';

const AutoRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectUser = () => {
      const user = authService.getCurrentUser();
      const permissions = authService.getPermissions();
      
      if (!user || !permissions) {
        navigate('/login');
        return;
      }

      // Verificar permisos y redirigir según corresponda
      const hasReportes = permissions.some(p => p.nombre_permiso === 'generar_reportes');
      const hasRutas = permissions.some(p => p.nombre_permiso === 'ver_rutas');
      const hasGestion = permissions.some(p => p.nombre_permiso === 'gestionar_catalogos');
      const isAdmin = user.rol_nombre === 'administrador';

      console.log('🔍 Verificando permisos del usuario:', {
        username: user.username,
        rol: user.rol_nombre,
        permisos: permissions.map(p => p.nombre_permiso),
        hasReportes,
        hasRutas,
        hasGestion,
        isAdmin
      });

      // Redirección inmediata según permisos
      if (isAdmin) {
        console.log('👑 Redirigiendo administrador al dashboard');
        navigate('/admin-dashboard');
        return;
      }

      if (hasReportes && !hasRutas && !hasGestion) {
        console.log('📊 Redirigiendo usuario con solo permisos de reportes');
        navigate('/reportes');
        return;
      }

      if (user.rol_nombre === 'piloto') {
        console.log('✈️ Redirigiendo piloto a sus rutas');
        navigate('/piloto-rutas');
        return;
      }

      if (hasRutas) {
        console.log('🛣️ Redirigiendo usuario con permisos de rutas');
        navigate('/rutas');
        return;
      }

      if (hasGestion) {
        console.log('👥 Redirigiendo usuario con permisos de gestión');
        navigate('/usuarios');
        return;
      }

      // Por defecto -> Reportes
      console.log('🔄 Redirigiendo por defecto a reportes');
      navigate('/reportes');
    };

    redirectUser();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#6b7280'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '20px'
      }}>
        🔄
      </div>
      <p>Redirigiendo...</p>
    </div>
  );
};

export default AutoRedirect;
