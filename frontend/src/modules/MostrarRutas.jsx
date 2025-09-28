// src/modules/MostrarRuta.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/mostrar-rutas.css";
import Logo from "../assets/logo.png";
import rutaService from "../services/rutaService";

export default function MostrarRuta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const rutaId = parseInt(id);

  const [rutaData, setRutaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos de la ruta desde la base de datos
  useEffect(() => {
    const cargarRuta = async () => {
      try {
        setLoading(true);
        setError("");

        console.log('Cargando ruta con ID:', rutaId);
        const response = await rutaService.getRutaById(rutaId);
        console.log('Respuesta del servicio:', response);
        
        if (response.success) {
          console.log('Datos de la ruta recibidos:', response.data);
          setRutaData(response.data);
        } else {
          setError("Error al cargar los datos de la ruta");
        }
      } catch (error) {
        console.error("Error cargando ruta:", error);
        setError("Error al cargar los datos de la ruta: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarRuta();
  }, [rutaId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos de la ruta...</p>
      </div>
    );
  }

  if (error || !rutaData) {
    return (
      <div className="error-container">
        <div className="error-message">{error || "Ruta no encontrada"}</div>
        <button onClick={() => navigate("/rutas")} className="form-button">
          Volver a Rutas
        </button>
      </div>
    );
  }

  return (
    <div className="ingresar-ruta-wrapper">
      <div className="ingresar-ruta-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-ruta-title">Detalles de la Ruta</h2>

        <div className="ingresar-ruta-form">
          {/* No. de Ruta */}
          <div className="form-group full-width">
            <label>No. de Ruta:</label>
            <input type="text" value={rutaData?.no_ruta || ''} readOnly className="small-input" />
          </div>

          {/* Cliente y Servicio */}
          <div className="form-row">
            <div className="form-group">
              <label>Cliente:</label>
              <input type="text" value={rutaData?.cliente_nombre || ''} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Servicio:</label>
              <input type="text" value={rutaData?.servicio || ''} readOnly className="full-input" />
            </div>
          </div>

          {/* Mercadería y Camión */}
          <div className="form-row">
            <div className="form-group">
              <label>Mercadería:</label>
              <input type="text" value={rutaData?.mercaderia || ''} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Camión:</label>
              <input type="text" value={rutaData?.camion_placa || ''} readOnly className="full-input" />
            </div>
          </div>

          {/* Combustible y Chofer */}
          <div className="form-row">
            <div className="form-group">
              <label>Combustible (gal.):</label>
              <input type="number" value={rutaData?.combustible || ''} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Chofer:</label>
              <input type="text" value={rutaData?.piloto_nombre || ''} readOnly className="full-input" />
            </div>
          </div>

          {/* Ayudante y Origen */}
          <div className="form-row">
            <div className="form-group">
              <label>Ayudante:</label>
              <input type="text" value={rutaData?.ayudante_nombre || 'Sin ayudante'} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Origen:</label>
              <input type="text" value={rutaData?.origen || ''} readOnly className="full-input" />
            </div>
          </div>

          {/* Destino y Fecha */}
          <div className="form-row">
            <div className="form-group">
              <label>Destino:</label>
              <input type="text" value={rutaData?.destino || ''} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Fecha:</label>
              <input 
                type="date" 
                value={rutaData?.fecha ? new Date(rutaData.fecha).toISOString().split('T')[0] : ''} 
                readOnly 
                className="full-input" 
              />
            </div>
          </div>

          {/* Hora y Precio */}
          <div className="form-row">
            <div className="form-group">
              <label>Hora (ETA):</label>
              <input type="time" value={rutaData?.hora || ''} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Precio del viaje (Q):</label>
              <input type="number" value={rutaData?.precio || ''} readOnly className="full-input" />
            </div>
          </div>

          {/* Comentario */}
          <div className="form-group full-width">
            <label>Comentario:</label>
            <textarea value={rutaData?.comentario || ""} readOnly className="full-input" rows={3} placeholder="Sin comentarios" />
          </div>

          {/* Estado */}
          <div className="form-group full-width">
            <label>Estado:</label>
            <input type="text" value={rutaData?.estado || ''} readOnly className="full-input" />
          </div>

          <div className="button-group">
            <button type="button" className="close-button" onClick={() => navigate("/rutas")}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
