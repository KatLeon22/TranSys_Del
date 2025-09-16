// src/modules/IngresarAyudante.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reutilizar.css"; // reutilizamos el mismo estilo
import Logo from "../assets/logo.png";

export default function IngresarAyudante() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    rutasAsignadas: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ayudante ingresado:", formData);
    alert("Ayudante ingresado (simulado)");
    navigate("/ayudantes"); // regresa a la tabla de ayudantes
  };

  return (
    <div className="ingresar-chofer-wrapper">
      <div className="ingresar-chofer-container">
        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <h2 className="ingresar-chofer-title">Ingresar Ayudante</h2>

        <form className="ingresar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rutasAsignadas">No. de Rutas:</label>
            <input
              type="number"
              id="rutasAsignadas"
              name="rutasAsignadas"
              value={formData.rutasAsignadas}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button">Ingresar</button>
            <button type="button" className="close-button" onClick={() => navigate("/ayudantes")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
