// src/modules/MostrarAyudante.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/mostrar-ayudantes.css";
import Logo from "../assets/logo.png";

export default function MostrarAyudante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ayudante, setAyudante] = useState(null);

  useEffect(() => {
    // Datos simulados
    const data = [
      { id: 1, nombre: "Pedro", apellido: "Santos", telefono: "+502 5551-2001" },
      { id: 2, nombre: "Carla", apellido: "Morales", telefono: "+502 5551-2002" },
      { id: 3, nombre: "Andrés", apellido: "Lopez", telefono: "+502 5551-2003" },
      { id: 4, nombre: "Luciana", apellido: "Ramírez", telefono: "+502 5551-2004" },
      { id: 5, nombre: "Jorge", apellido: "Hernández", telefono: "+502 5551-2005" },
      { id: 6, nombre: "Sofía", apellido: "Gutiérrez", telefono: "+502 5551-2006" },
    ];

    const found = data.find(a => a.id === parseInt(id));
    setAyudante(found);
  }, [id]);

  if (!ayudante) return <p>Cargando ayudante...</p>;

  return (
    <div className="mostrar-ayudante-wrapper">
      <div className="mostrar-ayudante-container">
        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <h2 className="mostrar-ayudante-title">Detalle Ayudante</h2>

        <form className="mostrar-ayudante-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={ayudante.nombre} disabled />
          </div>

          <div className="form-group">
            <label>Apellido:</label>
            <input type="text" value={ayudante.apellido} disabled />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input type="text" value={ayudante.telefono} disabled />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="close-button"
              onClick={() => navigate("/ayudantes")}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
