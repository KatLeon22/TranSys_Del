// src/modules/Ruta.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/rutas.css";

export default function Ruta({ rutas: rutasProp, setRutas: setRutasProp }) {
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [modal, setModal] = useState({ show: false, rutaId: null });

  const choferesDisponibles = ["Carlos Ramírez", "Pedro Martínez", "Luis Fernández"];
  const ayudantesDisponibles = ["Luis Gómez", "Ana López", "Marta Ruiz"];
  const camionesDisponibles = ["International", "XYZ789", "LMN456"];
  const estados = ["Pendiente", "En curso", "Entregado", "Incidente"];
  const acciones = ["Editar", "Mostrar", "Eliminar"];

  useEffect(() => {
    if (rutasProp && rutasProp.length > 0) {
      setRutas(rutasProp);
    } else {
      const data = [
        {
          id: 1,
          noRuta: "R001",
          cliente: "Juan Pérez",
          servicio: "Entrega",
          mercaderia: "Electrodomésticos",
          camion: "ABC123",
          origen: "Guatemala",
          destino: "Quetzaltenango",
          chofer: "Carlos Ramírez",
          ayudante: "Luis Gómez",
          fecha: "2025-09-14",
          hora: "14:30",
          estado: "Pendiente",
          precio: 150,
          comentario: "",
        },
        {
          id: 2,
          noRuta: "R002",
          cliente: "Laura García",
          servicio: "Recolección",
          mercaderia: "Muebles",
          camion: "XYZ789",
          origen: "Escuintla",
          destino: "Guatemala",
          chofer: "Pedro Martínez",
          ayudante: "Ana López",
          fecha: "2025-09-15",
          hora: "09:00",
          estado: "En curso",
          precio: 200,
          comentario: "Entrega parcial",
        },
      ];
      setRutas(data);
      if (setRutasProp) setRutasProp(data);
    }
  }, [rutasProp, setRutasProp]);

  const rutasFiltradas = rutas.filter(
    r =>
      r.noRuta.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.chofer.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRutas = rutasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rutasFiltradas.length / itemsPerPage);

  const handleChange = (id, field, value) => {
    const updated = rutas.map(r => (r.id === id ? { ...r, [field]: value } : r));
    setRutas(updated);
    if (setRutasProp) setRutasProp(updated);
  };

  const handleAccionChange = (id, value) => {
    if (value === "Eliminar") setModal({ show: true, rutaId: id });
    else if (value === "Editar") navigate(`/editar-ruta/${id}`);
    else if (value === "Mostrar") navigate(`/mostrar-ruta/${id}`);
  };

  const confirmarEliminar = () => {
    const updated = rutas.filter(r => r.id !== modal.rutaId);
    setRutas(updated);
    if (setRutasProp) setRutasProp(updated);
    setModal({ show: false, rutaId: null });
  };

  const choferesOcupados = rutas.map(r => r.chofer);
  const ayudantesOcupados = rutas.map(r => r.ayudante);

  return (
    <div className="rutas-container">
      <h2>Gestión de Rutas</h2>

      <div className="rutas-controls-top">
        <div className="rutas-pages-left">
          Mostrar
          <select
            value={itemsPerPage}
            onChange={e => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="rutas-select"
          >
            {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          datos de {rutasFiltradas.length}
        </div>

        <div className="rutas-search-center">
          <label htmlFor="busqueda">Búsqueda:</label>
          <input
            id="busqueda"
            type="text"
            placeholder="Buscar ruta..."
            className="rutas-search"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <button
          className="rutas-button ingresar-btn"
          onClick={() => navigate("/ingresar-ruta")}
        >
          + Ingresar Ruta
        </button>
      </div>

      <table className="rutas-table">
        <thead>
          <tr>
            <th>No. Ruta</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Mercadería</th>
            <th>Camión</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Chofer</th>
            <th>Ayudante</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Precio</th>
            <th style={{width: "50px"}}>Comentario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentRutas.map(ruta => (
            <tr key={ruta.id}>
              <td>{ruta.noRuta}</td>
              <td>{ruta.cliente}</td>
              <td>{ruta.servicio}</td>
              <td>{ruta.mercaderia}</td>
              <td>
                <select value={ruta.camion} onChange={e => handleChange(ruta.id,'camion',e.target.value)}>
                  {camionesDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </td>
              <td>{ruta.origen}</td>
              <td>{ruta.destino}</td>
              <td>
                <select value={ruta.chofer} onChange={e => handleChange(ruta.id,'chofer',e.target.value)}>
                  {choferesDisponibles.map(c => (
                    <option key={c} value={c} disabled={choferesOcupados.includes(c) && c !== ruta.chofer}>{c}</option>
                  ))}
                </select>
              </td>
              <td>
                <select value={ruta.ayudante} onChange={e => handleChange(ruta.id,'ayudante',e.target.value)}>
                  {ayudantesDisponibles.map(a => (
                    <option key={a} value={a} disabled={ayudantesOcupados.includes(a) && a !== ruta.ayudante}>{a}</option>
                  ))}
                </select>
              </td>
              <td>{ruta.fecha}</td>
              <td>{ruta.hora}</td>
              <td>
                <select
                  className="estado-select"
                  value={ruta.estado}
                  onChange={e => handleChange(ruta.id,'estado',e.target.value)}
                  style={{
                    backgroundColor: ruta.estado === "Pendiente" ? "#facc15" :
                                     ruta.estado === "En curso" ? "#2563eb" :
                                     ruta.estado === "Entregado" ? "#16a34a" :
                                     ruta.estado === "Incidente" ? "#dc2626" : "#f3f4f6",
                    color: ruta.estado === "Pendiente" ? "#1f2937" : "white"
                  }}
                >
                  {estados.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </td>
              <td>Q{ruta.precio}</td>
              <td style={{maxWidth: "50px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                {ruta.comentario || "-"}
              </td>
              <td>
                <select onChange={e => handleAccionChange(ruta.id,e.target.value)}>
                  <option value="">Seleccionar</option>
                  {acciones.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rutas-pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev-1,1))} disabled={currentPage===1} className="rutas-button">Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev+1,totalPages))} disabled={currentPage===totalPages} className="rutas-button">Siguiente</button>
      </div>

      {modal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Desea eliminar la ruta?</p>
            <div className="modal-buttons">
              <button className="form-button" onClick={confirmarEliminar}>Sí</button>
              <button className="close-button" onClick={() => setModal({show:false,rutaId:null})}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
