import React from "react";
import LogoutButton from "./LogoutButton";
import MobileMenuToggle from "./MobileMenuToggle";
import authService from "../services/authService.js";

export default function PilotoNavbar({ onToggleMobileMenu }) {
  const user = authService.getCurrentUser();
  
  return (
    <header className="piloto-navbar">
      <MobileMenuToggle 
        isOpen={false} 
        onToggle={onToggleMobileMenu}
      />
      <div className="navbar-content">
        <div className="navbar-left">
          <h1>Panel de Piloto</h1>
          <span className="navbar-subtitle">Sistema de Gestión de Rutas</span>
        </div>
        
        <div className="navbar-right">
          <div className="user-info">
            <span className="user-name">👨‍✈️ {user?.username || 'Piloto'}</span>
            <span className="user-role">Piloto</span>
          </div>
          <LogoutButton className="btn-logout">Cerrar Sesión</LogoutButton>
        </div>
      </div>
    </header>
  );
}





