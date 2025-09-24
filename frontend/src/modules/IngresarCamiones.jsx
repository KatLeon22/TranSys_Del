// src/modules/IngresarCamiones.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import camionesService from "../services/camionesService.js";
import "../styles/reutilizar.css"; // reutilizamos el mismo estilo
import Logo from "../assets/logo.png"; // asegúrate de tener el logo

export default function IngresarCamiones() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    tipo: "",
    tarjetaCirculacion: ""
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
      console.log("Creando nuevo camión:", formData);
      
      // Mapear los datos del frontend al formato que espera el backend
      const camionData = {
        placa: formData.placa,
        marca: formData.marca,
        modelo: formData.modelo,
        color: formData.color,
        tipo: formData.tipo,
        tarjeta_circulacion: formData.tarjetaCirculacion
      };
      
      const response = await camionesService.createCamion(camionData);
      
      if (response.success) {
        alert("Camión creado exitosamente");
        
        // Reiniciar formulario
        setFormData({
          placa: "",
          marca: "",
          modelo: "",
          color: "",
          tipo: "",
          tarjetaCirculacion: ""
        });
        
        // Redirigir a la lista de camiones
        navigate("/camiones");
      } else {
        setError(response.message || "Error al crear el camión");
      }
    } catch (error) {
      console.error("Error creando camión:", error);
      setError("Error al crear el camión: " + error.message);
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

          <div className="form-group">
            <label htmlFor="tarjetaCirculacion">Tarjeta de Circulación:</label>
            <input
              type="text"
              id="tarjetaCirculacion"
              name="tarjetaCirculacion"
              value={formData.tarjetaCirculacion}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="form-button" disabled={loading}>
              {loading ? "Creando..." : "Ingresar"}
            </button>
            <button type="button" className="close-button" onClick={() => navigate("/camiones")} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
