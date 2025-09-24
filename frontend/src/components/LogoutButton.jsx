import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js';

const LogoutButton = ({ children, className = '', style = {} }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir al login
      navigate('/login');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={className}
      style={style}
    >
      {children || 'Cerrar Sesión'}
    </button>
  );
};

export default LogoutButton;




