import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ingresar-clientes.css"; // tu CSS específico
import Logo from "../assets/logo.png";

export default function IngresarClientes() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nuevo cliente:", cliente);
    alert("Cliente ingresado (simulado)");
    setCliente({ nombre: "", apellido: "", telefono: "" });
  };

  const handleClose = () => navigate("/clientes");

  return (
    <div className="ingresar-chofer-wrapper">
      <div className="ingresar-chofer-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-chofer-title">Ingresar Nuevo Cliente</h2>

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
            <button type="submit" className="form-button">Ingresar Cliente</button>
            <button type="button" className="form-button close-button" onClick={handleClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
