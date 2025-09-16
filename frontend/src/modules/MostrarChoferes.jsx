import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ver-choferes.css";
import Logo from "../assets/logo.png";

export default function MostrarChoferes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chofer } = location.state || {}; // <-- obtener chofer

  if (!chofer) {
    return (
      <div className="ver-chofer-wrapper">
        <div className="ver-chofer-container">
          <p>Chofer no encontrado</p>
          <button className="close-button" onClick={() => navigate("/choferes")}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ver-chofer-wrapper">
      <div className="ver-chofer-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>
        <h2 className="ver-chofer-title">Detalle del Chofer</h2>
        <form className="ver-chofer-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={chofer.nombre} readOnly />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input type="text" value={chofer.apellido} readOnly />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" value={chofer.telefono} readOnly />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <input type="text" value={chofer.rol} readOnly />
          </div>
          <div className="form-group">
            <label>Tipo de Licencia</label>
            <input type="text" value={chofer.tipoLicencia} readOnly />
          </div>
          <div className="button-group">
            <button type="button" className="close-button" onClick={() => navigate("/choferes")}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
