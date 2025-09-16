import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/editar-clientes.css";
import Logo from "../assets/logo.png";

export default function EditarClientes() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Simulamos datos de backend
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  useEffect(() => {
    // Aquí normalmente harías fetch desde API usando el id
    const dataFromBackend = {
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "+502 5551-3001",
    };
    setCliente(dataFromBackend);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cliente actualizado:", cliente);
    alert("Cliente actualizado (simulado)");
    navigate("/clientes");
  };

  const handleClose = () => {
    navigate("/clientes");
  };

  return (
    <div className="editar-clientes-wrapper">
      <div className="editar-clientes-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>
        <h2 className="editar-clientes-title">Editar Cliente</h2>
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
            <button type="submit" className="form-button ingresar-btn">
              Guardar Cambios
            </button>
            <button type="button" className="close-button" onClick={handleClose}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
