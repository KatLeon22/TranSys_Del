import React from "react";
import LogoutButton from "./LogoutButton";
import authService from "../services/authService.js";

export default function Navbar() {
  const user = authService.getCurrentUser();
  
  return (
    <header className="navbar">
      <h1>Panel Administrativo</h1>
      <div className="user">
        <span>Usuario: {user?.username || 'Usuario'}</span>
        <span>Rol: {user?.rol_nombre || 'Sin rol'}</span>
        <LogoutButton>Cerrar sesión</LogoutButton>
      </div>
    </header>
  );
}
