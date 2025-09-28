import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clientesService from "../services/clientesService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/editar-clientes.css";
import Logo from "../assets/logo.png";

export default function EditarClientes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const clienteId = parseInt(id);

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    cargarCliente();
  }, [clienteId]);

  const cargarCliente = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('Cargando cliente con ID:', clienteId);
      const response = await clientesService.getClienteById(clienteId);
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('Datos del cliente recibidos:', response.data);
        setCliente({
          nombre: response.data.nombre || "",
          apellido: response.data.apellido || "",
          telefono: response.data.telefono || "",
        });
      } else {
        setError("Error al cargar los datos del cliente");
      }
    } catch (error) {
      console.error("Error cargando cliente:", error);
      setError("Error al cargar los datos del cliente: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      console.log("Actualizando cliente:", clienteId, cliente);
      
      const response = await clientesService.updateCliente(clienteId, cliente);
      
      if (response.success) {
        setSuccessMessage('Cliente actualizado exitosamente');
        setShowSuccessModal(true);
      } else {
        setError(response.message || "Error al actualizar el cliente");
      }
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      setError("Error al actualizar el cliente: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate("/clientes");
  };

  if (loading) {
    return (
      <div className="editar-clientes-wrapper">
        <div className="editar-clientes-container">
          <div className="logo-container">
            <img src={Logo} alt="Logo Empresa" className="logo" />
          </div>
          <h2 className="editar-clientes-title">Editar Cliente</h2>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos del cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !cliente.nombre) {
    return (
      <div className="editar-clientes-wrapper">
        <div className="editar-clientes-container">
          <div className="logo-container">
            <img src={Logo} alt="Logo Empresa" className="logo" />
          </div>
          <h2 className="editar-clientes-title">Editar Cliente</h2>
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={cargarCliente} className="form-button">
              Reintentar
            </button>
            <button onClick={handleClose} className="close-button">
              Volver a Clientes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-clientes-wrapper">
      <div className="editar-clientes-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>
        <h2 className="editar-clientes-title">Editar Cliente</h2>
        {console.log('Cliente actual en render:', cliente)}

        {error && (
          <div className="error-message" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form className="editar-clientes-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={cliente.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={cliente.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="form-button ingresar-btn" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button type="button" className="close-button" onClick={handleClose} disabled={saving}>
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
        type="edit"
      />
    </div>
  );
}
