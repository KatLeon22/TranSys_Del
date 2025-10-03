import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService.js";
import "../styles/login.css";

export default function Login() {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await authService.login(form.usuario, form.password);
      
      if (result.success) {
        // Redirigir según el rol del usuario
        if (result.user.rol_nombre === 'administrador') {
          navigate("/dashboard");
        } else if (result.user.rol_nombre === 'piloto') {
          navigate("/piloto-rutas"); // Los pilotos van a su módulo específico
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/src/assets/logo.png" alt="Logo S de León" className="company-logo" />
          <h2 className="login-title">Iniciar Sesión</h2>
          <p className="login-subtitle">Sistema de Administración de Rutas</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              autoComplete="new-password"
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="login-button">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
