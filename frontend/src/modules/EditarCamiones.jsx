// src/modules/EditarCamiones.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import camionesService from "../services/camionesService.js";
import "../styles/editar-camiones.css";
import Logo from "../assets/logo.png";

export default function EditarCamiones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camion, setCamion] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    tipo: "",
    tarjetaCirculacion: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cargar datos del camión
  useEffect(() => {
    const cargarCamion = async () => {
      try {
        setLoading(true);
        setError("");

        if (id) {
          // Cargar datos del camión desde la base de datos
          const response = await camionesService.getCamionById(id);
          
          if (response.success) {
            const camionData = response.data;
            console.log('Datos del camión recibidos:', camionData);
            
            setCamion({
              placa: camionData.placa || "",
              marca: camionData.marca || "",
              modelo: camionData.modelo || "",
              color: camionData.color || "",
              tipo: camionData.tipo || "",
              tarjetaCirculacion: camionData.tarjeta_circulacion || ""
            });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCamion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      console.log("Actualizando camión:", id, camion);
      
      // Mapear los datos del frontend al formato que espera el backend
      const camionData = {
        placa: camion.placa,
        marca: camion.marca,
        modelo: camion.modelo,
        color: camion.color,
        tipo: camion.tipo,
        tarjeta_circulacion: camion.tarjetaCirculacion
      };
      
      const response = await camionesService.updateCamion(id, camionData);
      
      if (response.success) {
        alert("Camión actualizado exitosamente");
        navigate("/camiones");
      } else {
        setError(response.message || "Error al actualizar el camión");
      }
    } catch (error) {
      console.error("Error actualizando camión:", error);
      setError("Error al actualizar el camión: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => navigate("/camiones");

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos del camión...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/camiones")} className="form-button">
          Volver a Camiones
        </button>
      </div>
    );
  }

  return (
    <div className="editar-chofer-wrapper">
      <div className="editar-chofer-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="editar-chofer-title">Editar Camión</h2>

        <form className="editar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Placa</label>
            <input type="text" name="placa" value={camion.placa} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Marca</label>
            <input type="text" name="marca" value={camion.marca} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <input type="text" name="modelo" value={camion.modelo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Color</label>
            <input type="text" name="color" value={camion.color} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <input type="text" name="tipo" value={camion.tipo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Tarjeta de circulación</label>
            <input type="text" name="tarjetaCirculacion" value={camion.tarjetaCirculacion} onChange={handleChange} required />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="form-button ingresar-btn" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button type="button" className="form-button close-button" onClick={handleClose} disabled={saving}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
