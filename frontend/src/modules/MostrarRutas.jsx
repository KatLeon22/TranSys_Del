// src/modules/MostrarRuta.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/mostrar-rutas.css"; // mismo estilo
import Logo from "../assets/logo.png";

export default function MostrarRuta({ rutas }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const rutaId = parseInt(id);

  // Encuentra la ruta a mostrar
  const ruta = rutas?.find(r => r.id === rutaId);

  if (!ruta) return <p>Ruta no encontrada</p>;

  return (
    <div className="ingresar-ruta-wrapper">
      <div className="ingresar-ruta-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-ruta-title">Detalles de la Ruta</h2>

        <div className="ingresar-ruta-form">

          {/* Fila 1: No. de Ruta */}
          <div className="form-group full-width">
            <label>No. de Ruta:</label>
            <input type="text" value={ruta.noRuta} readOnly className="small-input" />
          </div>

          {/* Fila 2: Cliente y Servicio */}
          <div className="form-row">
            <div className="form-group">
              <label>Cliente:</label>
              <input type="text" value={ruta.cliente} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Servicio:</label>
              <input type="text" value={ruta.servicio} readOnly className="full-input" />
            </div>
          </div>

          {/* Fila 3: Mercadería y Camión */}
          <div className="form-row">
            <div className="form-group">
              <label>Mercadería:</label>
              <input type="text" value={ruta.mercaderia} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Camión:</label>
              <input type="text" value={ruta.camion} readOnly className="full-input" />
            </div>
          </div>

          {/* Fila 4: Chofer y Ayudante */}
          <div className="form-row">
            <div className="form-group">
              <label>Chofer:</label>
              <input type="text" value={ruta.chofer} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Ayudante:</label>
              <input type="text" value={ruta.ayudante} readOnly className="full-input" />
            </div>
          </div>

          {/* Fila 5: Origen y Destino */}
          <div className="form-row">
            <div className="form-group">
              <label>Origen:</label>
              <input type="text" value={ruta.origen} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Destino:</label>
              <input type="text" value={ruta.destino} readOnly className="full-input" />
            </div>
          </div>

          {/* Fila 6: Fecha y Hora */}
          <div className="form-row">
            <div className="form-group">
              <label>Fecha:</label>
              <input type="date" value={ruta.fecha} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Hora (ETA):</label>
              <input type="time" value={ruta.hora} readOnly className="full-input" />
            </div>
          </div>

          {/* Fila 7: Estado y Precio */}
          <div className="form-row">
            <div className="form-group">
              <label>Estado:</label>
              <input type="text" value={ruta.estado} readOnly className="full-input" />
            </div>
            <div className="form-group">
              <label>Precio (Q):</label>
              <input type="number" value={ruta.precio} readOnly className="full-input" />
            </div>
          </div>

          {/* Fila 8: Comentario */}
          <div className="form-group full-width">
            <label>Comentario:</label>
            <textarea
              value={ruta.comentario || ""}
              readOnly
              className="full-input"
              rows={3}
              placeholder="Sin comentarios"
            />
          </div>

          <div className="button-group">
            <button type="button" className="close-button" onClick={() => navigate("/rutas")}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
