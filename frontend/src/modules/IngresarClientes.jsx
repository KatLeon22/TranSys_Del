import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clientesService from "../services/clientesService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/ingresar-clientes.css"; // tu CSS específico
import Logo from "../assets/logo.png";

export default function IngresarClientes() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Creando nuevo cliente:", cliente);
      
      const response = await clientesService.createCliente(cliente);
      
      if (response.success) {
        setSuccessMessage('Cliente creado exitosamente');
        setShowSuccessModal(true);
        
        // Reiniciar formulario
        setCliente({
          nombre: "",
          apellido: "",
          telefono: ""
        });
      } else {
        setError(response.message || "Error al crear el cliente");
      }
    } catch (error) {
      console.error("Error creando cliente:", error);
      setError("Error al crear el cliente: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => navigate("/clientes");

  return (
    <div className="ingresar-chofer-wrapper">
      <div className="ingresar-chofer-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-chofer-title">Ingresar Nuevo Cliente</h2>

        {error && (
          <div className="error-message" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form className="ingresar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={cliente.apellido} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={cliente.telefono} onChange={handleChange} required />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button" style={{ backgroundColor: '#3292D3' }} disabled={loading}>
              {loading ? "Creando..." : "Ingresar Cliente"}
            </button>
            <button type="button" className="form-button close-button" onClick={handleClose} disabled={loading}>
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
          navigate("/clientes");
        }}
        message={successMessage}
        type="success"
      />
    </div>
  );
}
