// src/modules/MostrarCamiones.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import camionesService from "../services/camionesService.js";
import "../styles/mostrar-camiones.css";
import Logo from "../assets/logo.png";

export default function MostrarCamiones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camion, setCamion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos del camión desde la base de datos
  useEffect(() => {
    const cargarCamion = async () => {
      try {
        setLoading(true);
        setError("");

        if (id) {
          // Cargar datos del camión desde la base de datos
          const response = await camionesService.getCamionById(id);
          
          if (response.success) {
            console.log('Datos del camión recibidos:', response.data);
            setCamion(response.data);
          } else {
            setError("Error al cargar los datos del camión");
          }
        } else {
          setError("Camión no encontrado");
        }
      } catch (error) {
        console.error("Error cargando camión:", error);
        setError("Error al cargar los datos del camión: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarCamion();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos del camión...</p>
      </div>
    );
  }

  if (error || !camion) {
    return (
      <div className="error-container">
        <div className="error-message">{error || "Camión no encontrado"}</div>
        <button onClick={() => navigate("/camiones")} className="form-button">
          Volver a Camiones
        </button>
      </div>
    );
  }

  return (
    <div className="mostrar-camiones-wrapper">
      <div className="mostrar-camiones-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <h2 className="mostrar-camiones-title">Detalles del Camión</h2>

        <form className="mostrar-camiones-form">
          <div className="form-group">
            <label>Placa:</label>
            <input type="text" value={camion.placa || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Marca:</label>
            <input type="text" value={camion.marca || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Modelo:</label>
            <input type="text" value={camion.modelo || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Color:</label>
            <input type="text" value={camion.color || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Tipo:</label>
            <input type="text" value={camion.tipo || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Tarjeta de circulación:</label>
            <input type="text" value={camion.tarjeta_circulacion || ''} readOnly />
          </div>

          <div className="button-group">
            <button type="button" className="close-button" onClick={() => navigate("/camiones")}>Volver</button>
          </div>
        </form>
      </div>
    </div>
  );
}