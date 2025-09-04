import { useState, useEffect } from "react";
import { getChoferes, createChofer } from "../../services/choferesService";

export default function ChoferesList() {
  const [choferes, setChoferes] = useState([]);

  const fetchChoferes = async () => {
    const data = await getChoferes();
    setChoferes(data);
  };

  const addChofer = async () => {
    const nuevo = await createChofer({ nombre: "Pedro", apellido: "Martínez", licencia: "99999" });
    setChoferes([...choferes, nuevo]);
  };

  useEffect(() => {
    fetchChoferes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Choferes</h2>
      <button onClick={addChofer}>Agregar Chofer Dummy</button>
      <ul>
        {choferes.map((c) => (
          <li key={c.id}>{c.nombre} {c.apellido} - Licencia: {c.licencia}</li>
        ))}
      </ul>
    </div>
  );
}
