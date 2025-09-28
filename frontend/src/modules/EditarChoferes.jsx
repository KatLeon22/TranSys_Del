// src/modules/EditarChoferes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/editar-choferes.css";
import Logo from "../assets/logo.png";
import choferesService from "../services/choferesService";
import PopUp from "../components/PopUp.jsx";

export default function EditarChoferes() {
  const navigate = useNavigate();
  const location = useLocation();
  const chofer = location.state?.chofer;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    tipoLicencia: "",
    fechaVencimiento: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar datos del chofer
  useEffect(() => {
    const cargarChofer = async () => {
      try {
        setLoading(true);
        setError("");

        if (chofer?.id) {
          // Cargar datos del chofer desde la base de datos
          const response = await choferesService.getChoferById(chofer.id);
          
          if (response.success) {
            const choferData = response.data;
            console.log('Datos del chofer recibidos:', choferData);
            console.log('Fecha original:', choferData.vencimiento);
            
            let fechaFormateada = "";
            if (choferData.vencimiento) {
              try {
                const fecha = new Date(choferData.vencimiento);
                if (!isNaN(fecha.getTime())) {
                  fechaFormateada = fecha.toISOString().split('T')[0];
                } else {
                  console.warn('Fecha inválida:', choferData.vencimiento);
                }
              } catch (error) {
                console.error('Error formateando fecha:', error);
              }
            }
            console.log('Fecha formateada:', fechaFormateada);
            
            setFormData({
              nombre: choferData.nombre || "",
              apellido: choferData.apellido || "",
              telefono: choferData.telefono || "",
              tipoLicencia: choferData.tipo_licencia || "",
              fechaVencimiento: fechaFormateada
            });
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

    cargarChofer();
  }, [chofer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      console.log("Actualizando piloto:", chofer.id, formData);
      
      // Mapear los datos del frontend al formato que espera el backend
      const choferData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        tipo_licencia: formData.tipoLicencia,
        vencimiento: formData.fechaVencimiento
      };
      
      const response = await choferesService.updateChofer(chofer.id, choferData);
      
      if (response.success) {
        setSuccessMessage('Piloto actualizado exitosamente');
        setShowSuccessModal(true);
      } else {
        setError(response.message || "Error al actualizar el piloto");
      }
    } catch (error) {
      console.error("Error actualizando piloto:", error);
      setError("Error al actualizar el piloto: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/choferes");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos del piloto...</p>
      </div>
    );
  }

  if (error && !chofer?.id) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/choferes")} className="form-button">
          Volver a Pilotos
        </button>
      </div>
    );
  }

  return (
    <div className="editar-chofer-wrapper">
      <div className="editar-chofer-container">
        <h2 className="editar-chofer-title">Editar Piloto</h2>
        {console.log('FormData actual:', formData)}

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Logo de la empresa debajo del título */}
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <form className="editar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo de Licencia</label>
            <input
              type="text"
              name="tipoLicencia"
              value={formData.tipoLicencia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Vencimiento de Licencia</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className="close-button" onClick={handleCancel} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* PopUp de éxito */}
      <PopUp
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/choferes");
        }}
        message={successMessage}
        type="edit"
      />
    </div>
  );
}
