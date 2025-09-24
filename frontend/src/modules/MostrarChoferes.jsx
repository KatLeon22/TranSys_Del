// src/modules/MostrarChoferes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ver-choferes.css";
import Logo from "../assets/logo.png";
import choferesService from "../services/choferesService";

export default function MostrarChoferes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chofer } = location.state || {}; // <-- obtener chofer

  const [pilotoData, setPilotoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos del piloto desde la base de datos
  useEffect(() => {
    const cargarPiloto = async () => {
      try {
        setLoading(true);
        setError("");

        if (chofer?.id) {
          // Cargar datos del piloto desde la base de datos
          const response = await choferesService.getChoferById(chofer.id);
          
          if (response.success) {
            console.log('Datos del piloto recibidos:', response.data);
            console.log('Fecha de vencimiento:', response.data.vencimiento);
            setPilotoData(response.data);
          } else {
            setError("Error al cargar los datos del piloto");
          }
        } else {
          setError("Piloto no encontrado");
        }
      } catch (error) {
        console.error("Error cargando piloto:", error);
        setError("Error al cargar los datos del piloto: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPiloto();
  }, [chofer]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos del piloto...</p>
      </div>
    );
  }

  if (error || !chofer) {
    return (
      <div className="ver-chofer-wrapper">
        <div className="ver-chofer-container">
          <div className="error-message" style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            {error || "Piloto no encontrado"}
          </div>
          <button className="close-button" onClick={() => navigate("/choferes")}>
            Volver a Pilotos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ver-chofer-wrapper">
      <div className="ver-chofer-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>
        <h2 className="ver-chofer-title">Detalle del Piloto</h2>
        {console.log('Datos a mostrar:', pilotoData)}
        {console.log('Fecha vencimiento en formulario:', pilotoData?.vencimiento)}
        <form className="ver-chofer-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={pilotoData?.nombre || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input type="text" value={pilotoData?.apellido || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" value={pilotoData?.telefono || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Tipo de Licencia</label>
            <input type="text" value={pilotoData?.tipo_licencia || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Fecha de Vencimiento de Licencia</label>
            <input 
              type="date" 
              value={(() => {
                const fecha = pilotoData?.vencimiento ? new Date(pilotoData.vencimiento).toISOString().split('T')[0] : '';
                console.log('Valor del input fecha:', fecha);
                return fecha;
              })()} 
              readOnly 
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="close-button"
              onClick={() => navigate("/choferes")}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
