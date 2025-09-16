// src/modules/MostrarClientes.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/mostrar-clientes.css"; // nueva hoja de estilos
import Logo from "../assets/logo.png";

export default function MostrarClientes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    // Datos simulados
    const data = [
      { id: 1, nombre: "Juan", apellido: "Pérez", telefono: "+502 5551-3001" },
      { id: 2, nombre: "Laura", apellido: "García", telefono: "+502 5551-3002" },
      { id: 3, nombre: "Pedro", apellido: "Martínez", telefono: "+502 5551-3003" },
      { id: 4, nombre: "Ana", apellido: "Santos", telefono: "+502 5551-3004" },
      { id: 5, nombre: "Carlos", apellido: "Ramírez", telefono: "+502 5551-3005" },
      { id: 6, nombre: "Sofía", apellido: "López", telefono: "+502 5551-3006" },
    ];

    const found = data.find(c => c.id === parseInt(id));
    setCliente(found || null);
  }, [id]);

  if (!cliente) return <p>Cliente no encontrado</p>;

  return (
    <div className="mostrar-clientes-wrapper">
      <div className="mostrar-clientes-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="mostrar-clientes-title">Detalle del Cliente</h2>

        <div className="mostrar-clientes-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={cliente.nombre} readOnly />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" value={cliente.apellido} readOnly />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" value={cliente.telefono} readOnly />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="close-button"
              onClick={() => navigate("/clientes")}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
