// src/modules/Ayudantes.jsx
import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import ayudantesService from "../services/ayudantesService.js";
import "../styles/reutilizar.css";

export default function Ayudantes() {
  const [ayudantes, setAyudantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [ayudanteToDelete, setAyudanteToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarAyudantes();
  }, []);

  const cargarAyudantes = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('Cargando ayudantes desde la base de datos...');
      
      const response = await ayudantesService.getAyudantes();
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('Ayudantes cargados:', response.data);
        setAyudantes(response.data);
      } else {
        setError("Error al cargar los ayudantes");
      }
    } catch (error) {
      console.error("Error cargando ayudantes:", error);
      setError("Error al cargar los ayudantes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionChange = (e, ayudante) => {
    const action = e.target.value;
    e.target.value = "";

    if (action === "editar") {
      navigate(`/editar-ayudantes/${ayudante.id}`, { state: { ayudante } });
    } else if (action === "mostrar") {
      navigate(`/mostrar-ayudante/${ayudante.id}`, { state: { ayudante } });
    } else if (action === "eliminar") {
      setAyudanteToDelete(ayudante);
      setModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log('Eliminando ayudante:', ayudanteToDelete.id);
      const response = await ayudantesService.deleteAyudante(ayudanteToDelete.id);
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        setAyudantes(prev => prev.filter(a => a.id !== ayudanteToDelete.id));
        setModalVisible(false);
        setAyudanteToDelete(null);
        setError(''); // Limpiar errores anteriores
        alert("Ayudante eliminado exitosamente");
      } else {
        setError(response.message || 'Error al eliminar el ayudante');
      }
    } catch (error) {
      console.error('Error eliminando ayudante:', error);
      setError(error.message || 'Error al eliminar el ayudante');
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setAyudanteToDelete(null);
  };

  const ayudantesFiltrados = ayudantes.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.apellido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAyudantes = ayudantesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ayudantesFiltrados.length / itemsPerPage);

  if (loading) {
    return (
      <div className="reutilizar-container">
        <h2>Ayudantes</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando ayudantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reutilizar-container">
        <h2>Ayudantes</h2>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={cargarAyudantes} className="reutilizar-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reutilizar-container">
      <h2>Ayudantes</h2>

      {error && (
        <div className="error-message" style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div className="reutilizar-controls-top">
        <div className="reutilizar-pages-left">
          Mostrar
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="reutilizar-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          datos de {ayudantesFiltrados.length}
        </div>

        <div className="reutilizar-search-center">
          <label htmlFor="busqueda">Búsqueda:</label>
          <input
            type="text"
            id="busqueda"
            placeholder="Buscar ayudante..."
            className="reutilizar-search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div>
          <button
            className="reutilizar-button ingresar-btn"
            onClick={() => navigate("/ingresar-ayudante")}
          >
            + Ingresar Ayudante
          </button>
        </div>
      </div>

      <table className="reutilizar-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentAyudantes.map((ayudante) => (
            <tr key={ayudante.id}>
              <td>{ayudante.nombre}</td>
              <td>{ayudante.apellido}</td>
              <td>{ayudante.telefono}</td>
              <td>
                <select onChange={(e) => handleActionChange(e, ayudante)} className="reutilizar-select">
                  <option value="">Seleccionar</option>
                  <option value="editar">Editar</option>
                  <option value="mostrar">Mostrar</option>
                  <option value="eliminar">Eliminar</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="reutilizar-pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="reutilizar-button"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="reutilizar-button"
        >
          Siguiente
        </button>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Deseas eliminar a {ayudanteToDelete.nombre} {ayudanteToDelete.apellido}?</p>
            <div className="modal-buttons">
              <button className="form-button" onClick={confirmDelete}>Sí</button>
              <button className="close-button" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
