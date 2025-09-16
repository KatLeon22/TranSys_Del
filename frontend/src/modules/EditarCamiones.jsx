// src/modules/EditarCamiones.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/editar-camiones.css"; // nueva hoja de estilos
import Logo from "../assets/logo.png";

export default function EditarCamiones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camion, setCamion] = useState({
    placa: "",
    marca: "",
    modelo: "",
    color: "",
    tipo: ""
  });

  useEffect(() => {
    // Datos simulados
    const data = [
      { id: 1, placa: "P-123FDS", marca: "Freightliner", modelo: "Cascadia", color: "Blanco", tipo: "Tráiler" },
      { id: 2, placa: "P-456ASD", marca: "Kenworth", modelo: "T680", color: "Azul", tipo: "Camión pesado" },
      { id: 3, placa: "P-789QWE", marca: "Volvo", modelo: "VNL", color: "Rojo", tipo: "Tráiler" },
      { id: 4, placa: "P-321RTY", marca: "International", modelo: "LT", color: "Negro", tipo: "Camión mediano" },
      { id: 5, placa: "P-654FGH", marca: "Mack", modelo: "Anthem", color: "Gris", tipo: "Tráiler" },
      { id: 6, placa: "P-987JKL", marca: "Mercedes", modelo: "Actros", color: "Blanco", tipo: "Camión pesado" },
    ];

    const found = data.find(c => c.id === parseInt(id));
    if (found) {
      setCamion(found);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCamion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Camión editado:", camion);
    alert("Camión actualizado (simulado)");
    navigate("/camiones");
  };

  const handleClose = () => navigate("/camiones");

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

          <div className="button-group">
            <button type="submit" className="form-button ingresar-btn">Guardar Cambios</button>
            <button type="button" className="form-button close-button" onClick={handleClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
