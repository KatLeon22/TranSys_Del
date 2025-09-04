import React from "react";

import { useState, useEffect } from "react";
import { getRutas } from "../../services/rutasService";

export default function RutasList() {
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    getRutas().then(setRutas);
  }, []);

  return (
    <div>
      <h2>Rutas</h2>
      <ul>
        {rutas.map(c => (
          <li key={c.id}>{c.cliente} {c.piloto} - Ayudante: {c.ayudante}</li>
        ))}
      </ul>
    </div>
  );
}
