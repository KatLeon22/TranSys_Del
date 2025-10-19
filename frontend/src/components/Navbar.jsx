import React from "react";
import LogoutButton from "./LogoutButton";
import MobileMenuToggle from "./MobileMenuToggle";
import authService from "../services/authService.js";
import "../styles/navbar.css";

export default function Navbar({ onToggleMobileMenu }) {
  const user = authService.getCurrentUser();
  
  // Determinar el icono según el rol
  const getRoleIcon = () => {
    if (user?.rol_nombre === 'piloto') {
      return '👨‍✈️';
    }
    return '👨‍💼';
  };
  
  return (
    <header className="navbar">
      <MobileMenuToggle 
        isOpen={false} 
        onToggle={onToggleMobileMenu}
      />
      <div className="user">
        <span className="user-info">
          Usuario: {user?.username || 'Usuario'}
        </span>
        <span className="admin-icon">{getRoleIcon()}</span>
        <span>Rol: {user?.rol_nombre || 'Sin rol'}</span>
        <LogoutButton>Cerrar sesión</LogoutButton>
      </div>
    </header>
  );
}
