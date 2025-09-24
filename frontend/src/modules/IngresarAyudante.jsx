// src/modules/IngresarAyudante.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ayudantesService from "../services/ayudantesService.js";
import "../styles/reutilizar.css"; // reutilizamos el mismo estilo
import Logo from "../assets/logo.png";

export default function IngresarAyudante() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Creando nuevo ayudante:", formData);
      
      const response = await ayudantesService.createAyudante(formData);
      
      if (response.success) {
        alert("Ayudante creado exitosamente");
        
        // Reiniciar formulario
        setFormData({
          nombre: "",
          apellido: "",
          telefono: ""
        });
        
        // Redirigir a la lista de ayudantes
        navigate("/ayudantes");
      } else {
        setError(response.message || "Error al crear el ayudante");
      }
    } catch (error) {
      console.error("Error creando ayudante:", error);
      setError("Error al crear el ayudante: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ingresar-chofer-wrapper">
      <div className="ingresar-chofer-container">
        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <h2 className="ingresar-chofer-title">Ingresar Ayudante</h2>

        {error && (
          <div className="error-message" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
            {error}
          </div>
        )}

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

          <div className="button-group">
            <button type="submit" className="form-button" disabled={loading}>
              {loading ? "Creando..." : "Ingresar"}
            </button>
            <button type="button" className="close-button" onClick={() => navigate("/ayudantes")} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
