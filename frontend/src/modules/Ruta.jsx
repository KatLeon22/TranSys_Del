// src/modules/Ruta.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rutaService from "../services/rutaService.js";
import "../styles/rutas.css";

export default function Ruta({ rutas: rutasProp, setRutas: setRutasProp }) {
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [modal, setModal] = useState({ show: false, rutaId: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [choferesDisponibles, setChoferesDisponibles] = useState([]);
  const [ayudantesDisponibles, setAyudantesDisponibles] = useState([]);
  const [camionesDisponibles, setCamionesDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);

  const estados = ["Pendiente", "En curso", "Entregado", "Incidente"];
  const acciones = ["Editar", "Mostrar", "Eliminar"];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar todos los datos usando servicios
      const [rutasRes, choferesRes, camionesRes, clientesRes, ayudantesRes] = await Promise.all([
        rutaService.getAllRutas(),
        rutaService.getChoferes(),
        rutaService.getCamiones(),
        rutaService.getClientes(),
        rutaService.getAyudantes()
      ]);

      // Procesar rutas
      if (rutasRes.success) {
        const rutasFormateadas = rutasRes.data.map(ruta => ({
          id: ruta.id,
          noRuta: ruta.no_ruta,
          cliente: `${ruta.cliente_nombre} ${ruta.cliente_apellido}`,
          servicio: ruta.servicio,
          mercaderia: ruta.mercaderia,
          camion: ruta.camion_placa,
          combustible: ruta.combustible,
          origen: ruta.origen,
          destino: ruta.destino,
          chofer: `${ruta.piloto_nombre} ${ruta.piloto_apellido}`,
          ayudante: ruta.ayudante_nombre ? `${ruta.ayudante_nombre} ${ruta.ayudante_apellido}` : '',
          fecha: ruta.fecha,
          hora: ruta.hora,
          estado: ruta.estado,
          precio: ruta.precio,
          comentario: ruta.comentario || '',
          cliente_id: ruta.cliente_id,
          camion_id: ruta.camion_id,
          chofer_id: ruta.chofer_id,
          ayudante_id: ruta.ayudante_id
        }));
        setRutas(rutasFormateadas);
        if (setRutasProp) setRutasProp(rutasFormateadas);
      }

      // Procesar datos de referencia
      if (choferesRes.success) {
        setChoferesDisponibles(choferesRes.data.map(c => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido}`
        })));
      }

      if (camionesRes.success) {
        setCamionesDisponibles(camionesRes.data.map(c => ({
          id: c.id,
          placa: c.placa
        })));
      }

      if (clientesRes.success) {
        setClientesDisponibles(clientesRes.data.map(c => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido}`
        })));
      }

      if (ayudantesRes.success) {
        setAyudantesDisponibles(ayudantesRes.data.map(a => ({
          id: a.id,
          nombre: `${a.nombre} ${a.apellido}`
        })));
      }


    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = async (id, field, value) => {
    try {
      const ruta = rutas.find(r => r.id === id);
      if (!ruta) return;

      // Preparar datos para actualizar
      const updateData = { ...ruta };
      
      // Mapear campos del frontend a la API
      if (field === 'camion') {
        const camion = camionesDisponibles.find(c => c.placa === value);
        if (camion) updateData.camion_id = camion.id;
      } else if (field === 'chofer') {
        const chofer = choferesDisponibles.find(c => c.nombre === value);
        if (chofer) updateData.chofer_id = chofer.id;
      } else if (field === 'ayudante') {
        const ayudante = ayudantesDisponibles.find(a => a.nombre === value);
        if (ayudante) updateData.ayudante_id = ayudante.id;
      } else {
        updateData[field] = value;
      }

      // Usar servicio para actualizar
      const response = await rutaService.updateRuta(id, updateData);
      
      if (response.success) {
        const updated = rutas.map(r => (r.id === id ? { ...r, [field]: value } : r));
        setRutas(updated);
        if (setRutasProp) setRutasProp(updated);
      } else {
        setError('Error al actualizar la ruta');
      }
    } catch (error) {
      console.error('Error actualizando ruta:', error);
      setError('Error al actualizar la ruta. Intenta nuevamente.');
    }
  };

  const handleAccionChange = (id, value) => {
    if (value === "Eliminar") setModal({ show: true, rutaId: id });
    else if (value === "Editar") navigate(`/editar-ruta/${id}`);
    else if (value === "Mostrar") navigate(`/mostrar-ruta/${id}`);
  };

  const confirmarEliminar = async () => {
    try {
      const response = await rutaService.deleteRuta(modal.rutaId);
      
      if (response.success) {
        const updated = rutas.filter(r => r.id !== modal.rutaId);
        setRutas(updated);
        if (setRutasProp) setRutasProp(updated);
        setModal({ show: false, rutaId: null });
      } else {
        setError('Error al eliminar la ruta');
      }
    } catch (error) {
      console.error('Error eliminando ruta:', error);
      setError('Error al eliminar la ruta. Intenta nuevamente.');
    }
  };

  const choferesOcupados = rutas.map(r => r.chofer);
  const ayudantesOcupados = rutas.map(r => r.ayudante);

  if (loading) {
    return (
      <div className="rutas-container">
        <h2>Rutas</h2>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando rutas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rutas-container">
        <h2>Rutas</h2>
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          <p>{error}</p>
          <button onClick={cargarDatos} className="rutas-button">Reintentar</button>
          {error.includes('Sesión expirada') && (
            <button 
              onClick={() => window.location.href = '/login'} 
              className="rutas-button"
              style={{ marginLeft: '10px', backgroundColor: '#dc3545' }}
            >
              Ir al Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rutas-container">
      <h2>Rutas</h2>

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
            <th>Combustible<br />(gal.)</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Chofer</th>
            <th>Ayudante</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Precio del viaje</th>
            <th style={{width: "50px"}}>Comentario</th>
            <th>Estado</th>
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
                  {camionesDisponibles.map(c => <option key={c.id} value={c.placa}>{c.placa}</option>)}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={ruta.combustible}
                  onChange={e => handleChange(ruta.id, 'combustible', parseFloat(e.target.value))}
                  min="0"
                />
              </td>
              <td>{ruta.origen}</td>
              <td>{ruta.destino}</td>
              <td>
                <select value={ruta.chofer} onChange={e => handleChange(ruta.id,'chofer',e.target.value)}>
                  {choferesDisponibles.map(c => (
                    <option key={c.id} value={c.nombre} disabled={choferesOcupados.includes(c.nombre) && c.nombre !== ruta.chofer}>{c.nombre}</option>
                  ))}
                </select>
              </td>
              <td>
                <select value={ruta.ayudante} onChange={e => handleChange(ruta.id,'ayudante',e.target.value)}>
                  <option value="">Sin ayudante</option>
                  {ayudantesDisponibles.map(a => (
                    <option key={a.id} value={a.nombre} disabled={ayudantesOcupados.includes(a.nombre) && a.nombre !== ruta.ayudante}>{a.nombre}</option>
                  ))}
                </select>
              </td>
              <td>{ruta.fecha}</td>
              <td>{ruta.hora}</td>
              <td>Q{ruta.precio}</td>
              <td style={{maxWidth: "50px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                {ruta.comentario || "-"}
              </td>
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
