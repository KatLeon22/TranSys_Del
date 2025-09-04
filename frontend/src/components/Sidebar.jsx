import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: "200px", background: "#333", color: "#fff", padding: "20px" }}>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/choferes" style={{ color: "#fff" }}>Choferes</Link></li>
          <li><Link to="/camiones" style={{ color: "#fff" }}>Camiones</Link></li>
          <li><Link to="/rutas" style={{ color: "#fff" }}>Rutas</Link></li>
          <li><Link to="/mantenimientos" style={{ color: "#fff" }}>Mantenimientos</Link></li>
          <li><Link to="/reportes" style={{ color: "#fff" }}>Reportes</Link></li>
        </ul>
      </nav>
    </div>
  );
}
