// src/modules/EditarAyudantes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/editar-ayudantes.css";
import Logo from "../assets/logo.png";

export default function EditarAyudantes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Estado inicial del ayudante
  const [ayudante, setAyudante] = useState({
    nombre: "",
    apellido: "",
    telefono: ""
  });

  useEffect(() => {
    if (location.state && location.state.ayudante) {
      setAyudante(location.state.ayudante);
    } else {
      // Simulación de obtener ayudante por ID
      const data = {
        nombre: "Pedro",
        apellido: "Santos",
        telefono: "+502 5551-2001"
      };
      setAyudante(data);
    }
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAyudante(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ayudante actualizado:", ayudante);
    alert("Ayudante actualizado (simulado)");
    navigate("/ayudantes");
  };

  const handleClose = () => {
    navigate("/ayudantes");
  };

  return (
    <div className="editar-ayudante-wrapper">
      <div className="editar-ayudante-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="editar-ayudante-title">Editar Ayudante</h2>

        <form className="editar-ayudante-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={ayudante.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={ayudante.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={ayudante.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button">Guardar cambios</button>
            <button type="button" className="form-button close-button" onClick={handleClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
