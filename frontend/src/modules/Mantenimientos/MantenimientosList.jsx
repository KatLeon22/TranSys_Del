import { useState, useEffect } from "react";
import { getMantenimientos } from "../../services/mantenimientosService";

export default function MantenimientosList() {
  const [mantenimientos, setMantenimientos] = useState([]);

  useEffect(() => {
    getMantenimientos().then(setMantenimientos);
  }, []);

  return (
    <div>
      <h2>Mantenimientos</h2>
      <ul>
        {mantenimientos.map(c => (
          <li key={c.id}>{c.camion} {c.estado}</li>
        ))}
      </ul>
    </div>
  );
}
