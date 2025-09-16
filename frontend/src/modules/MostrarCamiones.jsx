// src/modules/MostrarCamiones.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/mostrar-camiones.css";
import Logo from "../assets/logo.png";

export default function MostrarCamiones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camion, setCamion] = useState(null);

  useEffect(() => {
    // Datos simulados de camiones
    const data = [
      { id: 1, placa: "P123ABC", marca: "Toyota", modelo: "Hiace", color: "Blanco", tipo: "Furgón" },
      { id: 2, placa: "P456DEF", marca: "Ford", modelo: "Transit", color: "Azul", tipo: "Camión" },
      { id: 3, placa: "P789GHI", marca: "Nissan", modelo: "NV350", color: "Rojo", tipo: "Furgón" },
      { id: 4, placa: "P321JKL", marca: "Mercedes", modelo: "Sprinter", color: "Negro", tipo: "Camión" },
    ];

    const foundCamion = data.find(c => c.id === parseInt(id));
    setCamion(foundCamion);
  }, [id]);

  if (!camion) {
    return (
      <div className="mostrar-camiones-wrapper">
        <div className="mostrar-camiones-container">
          <p>Camión no encontrado</p>
          <div className="button-group">
            <button className="close-button" onClick={() => navigate("/camiones")}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mostrar-camiones-wrapper">
      <div className="mostrar-camiones-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <h2 className="mostrar-camiones-title">Detalles del Camión</h2>

        <form className="mostrar-camiones-form">
          <div className="form-group">
            <label>Placa:</label>
            <input type="text" value={camion.placa} readOnly />
          </div>
          <div className="form-group">
            <label>Marca:</label>
            <input type="text" value={camion.marca} readOnly />
          </div>
          <div className="form-group">
            <label>Modelo:</label>
            <input type="text" value={camion.modelo} readOnly />
          </div>
          <div className="form-group">
            <label>Color:</label>
            <input type="text" value={camion.color} readOnly />
          </div>
          <div className="form-group">
            <label>Tipo:</label>
            <input type="text" value={camion.tipo} readOnly />
          </div>

          <div className="button-group">
            <button type="button" className="close-button" onClick={() => navigate("/camiones")}>Volver</button>
          </div>
        </form>
      </div>
    </div>
  );
}
