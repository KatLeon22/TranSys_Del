import React from "react";
import "../styles/dashboard.css";

// Importar íconos de react-icons
import { FaTruck, FaClock, FaExclamationTriangle, FaMoneyBillWave } from "react-icons/fa";

export default function Dashboard() {
  // Datos de ejemplo
  const stats = [
    { title: "Entregas hoy", value: 25, color: "#2563eb", icon: <FaTruck /> },
    { title: "A tiempo", value: 20, color: "#16a34a", icon: <FaClock /> },
    { title: "Reclamos", value: 2, color: "#dc2626", icon: <FaExclamationTriangle /> },
    { title: "Ingresos", value: "Q1,250", color: "#f59e0b", icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="dashboard">
      <h2>Resumen del día</h2>
      <div className="dashboard-cards">
        {stats.map((stat, index) => (
          <div className="card" key={index} style={{ borderTop: `5px solid ${stat.color}` }}>
            <div className="card-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
