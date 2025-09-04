import { useState, useEffect } from "react";
import { getCamiones } from "../../services/camionesService";

export default function CamionesList() {
  const [camiones, setCamiones] = useState([]);

  useEffect(() => {
    getCamiones().then(setCamiones);
  }, []);

  return (
    <div>
      <h2>Camiones</h2>
      <ul>
        {camiones.map(c => (
          <li key={c.id}>{c.marca} {c.color} - Placa: {c.placa}</li>
        ))}
      </ul>
    </div>
  );
}
