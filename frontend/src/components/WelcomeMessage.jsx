import React from 'react';
import authService from '../services/authService.js';

const WelcomeMessage = () => {
  const user = authService.getCurrentUser();
  const permissions = authService.getPermissions();

  const getWelcomeMessage = () => {
    if (!user || !permissions) return null;

    const hasReportes = permissions.some(p => p.nombre_permiso === 'generar_reportes');
    const hasRutas = permissions.some(p => p.nombre_permiso === 'ver_rutas');
    const hasGestion = permissions.some(p => p.nombre_permiso === 'gestionar_catalogos');
    const isAdmin = user.rol_nombre === 'administrador';

    if (isAdmin) {
      return {
        title: "Bienvenido, Administrador",
        message: "Tienes acceso completo al sistema de transporte",
        icon: "👑",
        color: "#103053"
      };
    }

    if (hasReportes && !hasRutas && !hasGestion) {
      return {
        title: `Bienvenido, ${user.username}`,
        message: "Tienes acceso exclusivo a la sección de reportes del sistema. Puedes generar y visualizar reportes de rutas.",
        icon: "📊",
        color: "#059669"
      };
    }

    if (hasRutas) {
      return {
        title: `Bienvenido, ${user.username}`,
        message: "Puedes gestionar las rutas del sistema",
        icon: "🛣️",
        color: "#2563eb"
      };
    }

    if (hasGestion) {
      return {
        title: `Bienvenido, ${user.username}`,
        message: "Puedes gestionar usuarios y catálogos del sistema",
        icon: "👥",
        color: "#7c3aed"
      };
    }

    if (user.rol_nombre === 'piloto') {
      return {
        title: `Bienvenido, Piloto ${user.username}`,
        message: "Puedes ver y gestionar tus rutas asignadas",
        icon: "✈️",
        color: "#dc2626"
      };
    }

    return null;
  };

  const welcome = getWelcomeMessage();

  if (!welcome) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${welcome.color}15 0%, ${welcome.color}05 100%)`,
      border: `2px solid ${welcome.color}30`,
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '15px'
      }}>
        {welcome.icon}
      </div>
      
      <h2 style={{
        color: welcome.color,
        fontSize: '1.5rem',
        marginBottom: '10px',
        fontWeight: '600'
      }}>
        {welcome.title}
      </h2>
      
      <p style={{
        color: '#6b7280',
        fontSize: '1rem',
        margin: '0'
      }}>
        {welcome.message}
      </p>
    </div>
  );
};

export default WelcomeMessage;
