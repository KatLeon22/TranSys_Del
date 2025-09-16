import React from "react";

export default function Navbar() {
  return (
    <header className="navbar">
      <h1>Panel Administrativo</h1>
      <div className="user">
        <span>Usuario: Admin</span>
        <button>Cerrar sesión</button>
      </div>
    </header>
  );
}
