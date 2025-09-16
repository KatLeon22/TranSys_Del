// src/modules/IngresarCamiones.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reutilizar.css"; // reutilizamos el mismo estilo
import Logo from "../assets/logo.png"; // asegúrate de tener el logo

export default function IngresarCamiones() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    tipo: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Camión ingresado:", formData);
    alert("Camión ingresado (simulado)");
    navigate("/camiones"); // regresa a la tabla de camiones
  };

  return (
    <div className="ingresar-chofer-wrapper">
      <div className="ingresar-chofer-container">
        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <h2 className="ingresar-chofer-title">Ingresar Camión</h2>

        <form className="ingresar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="placa">Placa:</label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="marca">Marca:</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modelo">Modelo:</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color:</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo:</label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button">Ingresar</button>
            <button type="button" className="close-button" onClick={() => navigate("/camiones")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
