// src/modules/Ruta.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rutaService from "../services/rutaService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/rutas.css";
import "../styles/rutas-responsive.css";

export default function Ruta({ rutas: rutasProp, setRutas: setRutasProp }) {
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [modal, setModal] = useState({ show: false, rutaId: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [choferesDisponibles, setChoferesDisponibles] = useState([]);
  const [ayudantesDisponibles, setAyudantesDisponibles] = useState([]);
  const [camionesDisponibles, setCamionesDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);

  const estados = ["Pendiente", "En curso", "Entregado", "Incidente"];
  const acciones = ["Editar", "Mostrar", "Eliminar"];

  useEffect(() => {
    cargarDatos();
  }, []);

  // Debug: mostrar información cuando cambie la búsqueda
  useEffect(() => {
    if (busqueda && tipoBusqueda === "servicio") {
      console.log('🔍 Cambio en búsqueda:', {
        busqueda: busqueda,
        tipoBusqueda: tipoBusqueda,
        totalRutas: rutas.length,
        rutasFiltradas: rutas.filter(r => r.servicio?.toLowerCase().trim().includes(busqueda.toLowerCase().trim())).length
      });
    }
  }, [busqueda, tipoBusqueda, rutas]);

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
          clienteNombre: ruta.cliente_nombre,
          clienteApellido: ruta.cliente_apellido,
          servicio: ruta.servicio,
          mercaderia: ruta.mercaderia,
          camion: ruta.camion_placa,
          combustible: ruta.combustible,
          origen: ruta.origen,
          destino: ruta.destino,
          chofer: `${ruta.piloto_nombre} ${ruta.piloto_apellido}`,
          choferNombre: ruta.piloto_nombre,
          choferApellido: ruta.piloto_apellido,
          ayudante: ruta.ayudante_nombre ? `${ruta.ayudante_nombre} ${ruta.ayudante_apellido}` : '',
          ayudanteNombre: ruta.ayudante_nombre,
          ayudanteApellido: ruta.ayudante_apellido,
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

  // Determinar si es una opción de ordenamiento
  const esOpcionOrdenamiento = tipoBusqueda === "no_ruta" && ["recientes", "antiguas", "ascendente", "descendente"].includes(busqueda);
  
  // Debug: mostrar información del ordenamiento
  console.log('🔍 Debug ordenamiento:', {
    tipoBusqueda,
    busqueda,
    esOpcionOrdenamiento,
    esAscendente: busqueda === 'ascendente',
    esDescendente: busqueda === 'descendente'
  });
  
  const rutasFiltradas = rutas.filter(r => {
    // Si es una opción de ordenamiento, mostrar todas las rutas
    if (esOpcionOrdenamiento) {
      return true;
    }
    
    if (!busqueda) return true;
    
    const busquedaLower = busqueda.toLowerCase().trim();
    
    // Debug: mostrar datos de búsqueda solo para servicio
    if (tipoBusqueda === "servicio") {
      console.log('🔍 Búsqueda en servicio:', {
        busqueda: busqueda,
        busquedaLower: busquedaLower,
        servicio: r.servicio,
        servicioLower: r.servicio?.toLowerCase()?.trim(),
        incluye: r.servicio?.toLowerCase()?.trim().includes(busquedaLower)
      });
    }
    
    switch (tipoBusqueda) {
      case "no_ruta":
        return r.noRuta?.toLowerCase().trim().includes(busquedaLower);
      case "cliente":
        return r.cliente?.toLowerCase().trim().includes(busquedaLower);
      case "servicio":
        return r.servicio?.toLowerCase().trim().includes(busquedaLower);
      case "todos":
      default:
        return r.noRuta?.toLowerCase().trim().includes(busquedaLower) ||
               r.cliente?.toLowerCase().trim().includes(busquedaLower) ||
               r.servicio?.toLowerCase().trim().includes(busquedaLower) ||
               r.chofer?.toLowerCase().trim().includes(busquedaLower);
    }
  }).sort((a, b) => {
    // Aplicar ordenamiento solo si se seleccionó una opción de ordenamiento
    if (esOpcionOrdenamiento) {
      switch (busqueda) {
        case "recientes":
          return new Date(b.fecha) - new Date(a.fecha); // Más recientes primero
        case "antiguas":
          return new Date(a.fecha) - new Date(b.fecha); // Más antiguas primero
        case "ascendente":
          return a.noRuta.localeCompare(b.noRuta); // A-Z
        case "descendente":
          return b.noRuta.localeCompare(a.noRuta); // Z-A
        default:
          return 0; // Sin ordenamiento
      }
    }
    return 0; // Sin ordenamiento
  });

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
        setSuccessMessage('La ruta ha sido eliminada exitosamente');
        setShowSuccessModal(true);
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
          <label htmlFor="tipo-busqueda">Buscar por:</label>
          <select
            id="tipo-busqueda"
            className="rutas-select"
            value={tipoBusqueda}
            onChange={e => setTipoBusqueda(e.target.value)}
          >
            <option value="todos">Todos los campos</option>
            <option value="no_ruta">No. Ruta</option>
            <option value="cliente">Cliente</option>
            <option value="servicio">Servicio</option>
          </select>
          
          <label htmlFor="busqueda">Búsqueda:</label>
          {tipoBusqueda === "cliente" ? (
            <select
              id="busqueda"
              className="rutas-select"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            >
              <option value="">Seleccionar cliente...</option>
              {clientesDisponibles.map(cliente => (
                <option key={cliente.id} value={cliente.nombre}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="busqueda"
              type="text"
              placeholder={
                tipoBusqueda === "no_ruta" ? "Buscar por número de ruta..." :
                tipoBusqueda === "servicio" ? "Buscar por servicio..." :
                "Buscar en todos los campos..."
              }
              className="rutas-search"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          )}
          
          {busqueda && (
            <button
              type="button"
              className="rutas-button"
              onClick={() => {
                setBusqueda("");
                setTipoBusqueda("todos");
              }}
              style={{ marginLeft: "10px", padding: "5px 10px", fontSize: "0.8rem" }}
            >
              Limpiar
            </button>
          )}
        </div>


        <button
          className="rutas-button ingresar-btn"
          onClick={() => navigate("/ingresar-ruta")}
        >
          + Ingresar Ruta
        </button>
      </div>

      <div className="rutas-responsive-container">
        <table className="rutas-table rutas-responsive-table">
        <thead>
          <tr>
            <th>No.<br />Ruta</th>
            <th style={{minWidth: "120px"}}>Cliente</th>
            <th style={{minWidth: "100px"}}>Servicio</th>
            <th>Mercadería</th>
            <th>Camión</th>
            <th>Combustible<br />(gal.)</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Chofer</th>
            <th>Ayudante</th>
            <th>Fecha de Ruta</th>
            <th>Hora</th>
            <th>Precio del<br />viaje</th>
            <th style={{width: "50px"}}>Comentario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentRutas.map(ruta => (
            <tr key={ruta.id}>
              <td style={{minWidth: "50px", padding: "2px", textAlign: "center", fontSize: "0.8rem", fontWeight: "600"}}>
                {ruta.noRuta.replace(/RUTA/gi, '').replace(/\s+/g, '')}
              </td>
              <td style={{lineHeight: "1.1", minWidth: "80px", padding: "2px"}}>
                <div style={{fontWeight: "600", color: "#1f2937", marginBottom: "1px", fontSize: "0.8rem"}}>{ruta.clienteNombre}</div>
                <div style={{fontSize: "0.75em", color: "#6b7280", fontStyle: "italic"}}>{ruta.clienteApellido}</div>
              </td>
              <td style={{minWidth: "70px", padding: "2px", fontSize: "0.8rem", wordBreak: "break-word", whiteSpace: "normal"}}>{ruta.servicio}</td>
              <td style={{minWidth: "80px", padding: "2px", fontSize: "0.8rem", wordBreak: "break-word", whiteSpace: "normal"}}>{ruta.mercaderia}</td>
              <td style={{minWidth: "60px", padding: "2px", fontSize: "0.8rem", textAlign: "center"}}>{ruta.camion}</td>
              <td style={{minWidth: "60px", padding: "2px", fontSize: "0.8rem", textAlign: "center"}}>{Math.round(ruta.combustible)} gal.</td>
              <td style={{minWidth: "60px", padding: "2px", fontSize: "0.8rem"}}>{ruta.origen}</td>
              <td style={{minWidth: "60px", padding: "2px", fontSize: "0.8rem"}}>{ruta.destino}</td>
              <td style={{lineHeight: "1.1", minWidth: "80px", padding: "2px"}}>
                <div style={{fontWeight: "600", color: "#1f2937", marginBottom: "1px", fontSize: "0.8rem"}}>{ruta.choferNombre}</div>
                <div style={{fontSize: "0.75em", color: "#6b7280", fontStyle: "italic"}}>{ruta.choferApellido}</div>
              </td>
              <td style={{lineHeight: "1.1", minWidth: "70px", padding: "2px"}}>
                {ruta.ayudanteNombre ? (
                  <>
                    <div style={{fontWeight: "600", color: "#1f2937", marginBottom: "1px", fontSize: "0.8rem"}}>{ruta.ayudanteNombre}</div>
                    <div style={{fontSize: "0.75em", color: "#6b7280", fontStyle: "italic"}}>{ruta.ayudanteApellido}</div>
                  </>
                ) : (
                  <div style={{fontSize: "0.8rem", color: "#9ca3af", fontStyle: "italic"}}>Sin ayudante</div>
                )}
              </td>
              <td style={{fontWeight: "500", color: "#374151", minWidth: "80px", padding: "2px", fontSize: "0.8rem"}}>
                {ruta.fecha ? new Date(ruta.fecha).toLocaleDateString() : '-'}
              </td>
              <td style={{minWidth: "50px", padding: "2px", fontSize: "0.8rem", textAlign: "center"}}>{ruta.hora ? ruta.hora.substring(0, 5) : '-'}</td>
              <td style={{fontWeight: "600", textAlign: "center", minWidth: "60px", padding: "2px", fontSize: "0.75rem"}}>
                Q{ruta.precio}
              </td>
              <td 
                style={{
                  minWidth: "80px", 
                  padding: "2px", 
                  fontSize: "0.75rem", 
                  wordBreak: "break-word", 
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "help"
                }}
                title={ruta.comentario || "Sin comentarios"}
              >
                {ruta.comentario ? 
                  (ruta.comentario.length > 25 ? `${ruta.comentario.substring(0, 25)}...` : ruta.comentario) 
                  : "-"
                }
              </td>
              <td style={{textAlign: "center", minWidth: "70px", padding: "2px"}}>
                <span
                  style={{
                    backgroundColor: ruta.estado === "Pendiente" ? "#facc15" :
                                     ruta.estado === "En curso" ? "#2563eb" :
                                     ruta.estado === "Entregado" ? "#16a34a" :
                                     ruta.estado === "Incidente" ? "#dc2626" : "#f3f4f6",
                    color: ruta.estado === "Pendiente" ? "#1f2937" : "white",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    display: "inline-block",
                    minWidth: "60px",
                    textAlign: "center"
                  }}
                >
                  {ruta.estado}
                </span>
              </td>
              <td style={{minWidth: "80px", padding: "2px"}}>
                <select 
                  onChange={e => handleAccionChange(ruta.id,e.target.value)}
                  style={{
                    width: "100%",
                    padding: "2px 4px",
                    fontSize: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "3px",
                    backgroundColor: "white"
                  }}
                >
                  <option value="">Seleccionar</option>
                  {acciones.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

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
      
      {/* PopUp de éxito */}
      <PopUp
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
        type="delete"
      />
    </div>
  );
}
