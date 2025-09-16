// src/modules/EditarChoferes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/editar-choferes.css";
import Logo from "../assets/logo.png";

export default function EditarChoferes() {
  const navigate = useNavigate();
  const location = useLocation();
  const chofer = location.state?.chofer;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    rol: "",
    tipoLicencia: ""
  });

  const [loading, setLoading] = useState(true);

  // Cargar datos del chofer
  useEffect(() => {
    if (chofer) {
      setFormData({
        nombre: chofer.nombre,
        apellido: chofer.apellido,
        telefono: chofer.telefono,
        rol: chofer.rol,
        tipoLicencia: chofer.tipoLicencia
      });
      setLoading(false);
    } else {
      alert("Chofer no encontrado");
      navigate("/choferes");
    }
  }, [chofer, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardar cambios usando localStorage temporalmente o implementar contexto/global state
    const storedChoferes = JSON.parse(localStorage.getItem("choferes")) || [];
    const updatedChoferes = storedChoferes.map(c =>
      c.id === chofer.id ? { ...c, ...formData } : c
    );
    localStorage.setItem("choferes", JSON.stringify(updatedChoferes));

    alert("Chofer actualizado correctamente");
    navigate("/choferes");
  };

  const handleCancel = () => {
    navigate("/choferes");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="editar-chofer-wrapper">
      <div className="editar-chofer-container">
        <h2 className="editar-chofer-title">Editar Piloto</h2>

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
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <input
              type="text"
              name="rol"
              value={formData.rol}
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

          <div className="button-group">
            <button type="submit" className="form-button">Guardar</button>
            <button type="button" className="close-button" onClick={handleCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
