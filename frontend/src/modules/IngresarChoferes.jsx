// src/modules/IngresarChoferes.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ingresar-choferes.css";
import Logo from "../assets/logo.png";
import choferesService from "../services/choferesService";
import PopUp from "../components/PopUp.jsx";

export default function IngresarChoferes() {
  const navigate = useNavigate();
  const [chofer, setChofer] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    tipoLicencia: "",
    fechaVencimiento: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para el campo de teléfono
    if (name === 'telefono') {
      // Permitir solo números, guiones, paréntesis y espacios
      const telefonoValido = value.replace(/[^0-9\s\-()]/g, '');
      setChofer((prev) => ({ ...prev, [name]: telefonoValido }));
    } else {
      setChofer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Creando nuevo piloto:", chofer);
      
      // Mapear los datos del frontend al formato que espera el backend
      const choferData = {
        nombre: chofer.nombre,
        apellido: chofer.apellido,
        telefono: chofer.telefono,
        tipo_licencia: chofer.tipoLicencia,
        vencimiento: chofer.fechaVencimiento
      };
      
      const response = await choferesService.createChofer(choferData);
      
      if (response.success) {
        setSuccessMessage('Piloto creado exitosamente');
        setShowSuccessModal(true);
        
        // Reiniciar formulario
        setChofer({
          nombre: "",
          apellido: "",
          telefono: "",
          tipoLicencia: "",
          fechaVencimiento: "",
        });
        
        // Redirigir a la lista de choferes
        navigate("/choferes");
      } else {
        setError(response.message || "Error al crear el piloto");
      }
    } catch (error) {
      console.error("Error creando piloto:", error);
      setError("Error al crear el piloto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/choferes");
  };

  return (
    <div className="ingresar-chofer-wrapper">
      <div className="ingresar-chofer-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-chofer-title">Ingresar Nuevo Piloto</h2>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="ingresar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={chofer.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={chofer.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={chofer.telefono}
              onChange={handleChange}
              pattern="[0-9\s\-()]+"
              title="Solo se permiten números, guiones, paréntesis y espacios"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Licencia</label>
            <input
              type="text"
              name="tipoLicencia"
              value={chofer.tipoLicencia}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha de Vencimiento de Licencia</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={chofer.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button" style={{ backgroundColor: '#3292D3' }} disabled={loading}>
              {loading ? "Creando..." : "Ingresar Piloto"}
            </button>
            <button
              type="button"
              className="form-button close-button"
              onClick={handleClose}
            >
              Cerrar
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
        type="success"
      />
    </div>
  );
}
