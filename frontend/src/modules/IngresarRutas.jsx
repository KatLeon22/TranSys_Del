// src/modules/IngresarRutas.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ingresar-rutas.css";
import Logo from "../assets/logo.png"; // Logo de la empresa

export default function IngresarRutas() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    noRuta: "",
    cliente: "",
    servicio: "",
    mercaderia: "",
    camion: "",
    chofer: "",
    ayudante: "",
    origen: "",
    destino: "",
    fecha: "",
    hora: "",
    estado: "",
    precio: "",
    comentario: "", // Nuevo campo
  });

  const choferesDisponibles = ["Carlos Ramírez", "Pedro Martínez", "Luis Fernández"];
  const ayudantesDisponibles = ["Luis Gómez", "Ana López", "Marta Ruiz"];
  const camionesDisponibles = ["ABC123", "XYZ789", "LMN456"];
  const estados = ["Pendiente", "En curso", "Entregado", "Incidente"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ruta ingresada:", formData);
    alert("Ruta ingresada (simulado)");
    navigate("/rutas");
  };

  return (
    <div className="ingresar-ruta-wrapper">
      <div className="ingresar-ruta-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-ruta-title">Ingresar Ruta</h2>

        <form className="ingresar-ruta-form" onSubmit={handleSubmit}>

          {/* Fila 1: No. de Ruta */}
          <div className="form-group full-width">
            <label>No. de Ruta:</label>
            <input
              type="text"
              name="noRuta"
              value={formData.noRuta}
              onChange={handleChange}
              className="small-input"
              required
            />
          </div>

          {/* Fila 2: Cliente y Servicio */}
          <div className="form-row">
            <div className="form-group">
              <label>Cliente:</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Servicio:</label>
              <input
                type="text"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
          </div>

          {/* Fila 3: Mercadería y Camión */}
          <div className="form-row">
            <div className="form-group">
              <label>Mercadería:</label>
              <input
                type="text"
                name="mercaderia"
                value={formData.mercaderia}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Camión:</label>
              <select
                name="camion"
                value={formData.camion}
                onChange={handleChange}
                required
                className="full-input"
              >
                <option value="">Seleccionar</option>
                {camionesDisponibles.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 4: Chofer y Ayudante */}
          <div className="form-row">
            <div className="form-group">
              <label>Chofer:</label>
              <select
                name="chofer"
                value={formData.chofer}
                onChange={handleChange}
                required
                className="full-input"
              >
                <option value="">Seleccionar</option>
                {choferesDisponibles.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ayudante:</label>
              <select
                name="ayudante"
                value={formData.ayudante}
                onChange={handleChange}
                required
                className="full-input"
              >
                <option value="">Seleccionar</option>
                {ayudantesDisponibles.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 5: Origen y Destino */}
          <div className="form-row">
            <div className="form-group">
              <label>Origen:</label>
              <input
                type="text"
                name="origen"
                value={formData.origen}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Destino:</label>
              <input
                type="text"
                name="destino"
                value={formData.destino}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
          </div>

          {/* Fila 6: Fecha y Hora */}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Hora (ETA):</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
          </div>

          {/* Fila 7: Estado y Precio */}
          <div className="form-row">
            <div className="form-group">
              <label>Estado:</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="full-input"
              >
                <option value="">Seleccionar</option>
                {estados.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Precio (Q):</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="full-input"
                required
              />
            </div>
          </div>

          {/* Fila 8: Comentario */}
          <div className="form-group full-width">
            <label>Comentario:</label>
            <textarea
              name="comentario"
              value={formData.comentario}
              onChange={handleChange}
              className="full-input"
              rows={3}
              placeholder="Agregar un comentario sobre la ruta..."
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button ingresar-btn">Ingresar</button>
            <button type="button" className="close-button" onClick={() => navigate("/rutas")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
