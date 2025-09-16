import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ingresar-choferes.css";
import Logo from "../assets/logo.png";

export default function IngresarChoferes() {
  const navigate = useNavigate();
  const [chofer, setChofer] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    rol: "Conductor",
    tipoLicencia: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChofer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nuevo chofer:", chofer);
    alert("Chofer ingresado (simulado)");
    setChofer({
      nombre: "",
      apellido: "",
      telefono: "",
      rol: "Conductor",
      tipoLicencia: "",
    });
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

        <h2 className="ingresar-chofer-title">Ingresar Nuevo Chofer</h2>

        <form className="ingresar-chofer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={chofer.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={chofer.apellido} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={chofer.telefono} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Rol</label>
            <input type="text" name="rol" value={chofer.rol} readOnly />
          </div>

          <div className="form-group">
            <label>Tipo de Licencia</label>
            <input type="text" name="tipoLicencia" value={chofer.tipoLicencia} onChange={handleChange} required />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button">Ingresar Chofer</button>
            <button type="button" className="form-button close-button" onClick={handleClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
