// src/modules/Camiones.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import camionesService from "../services/camionesService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/reutilizar.css";

export default function Camiones() {
  const [camiones, setCamiones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [camionToDelete, setCamionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    cargarCamiones();
  }, []);

  const cargarCamiones = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('Cargando camiones desde la base de datos...');
      
      const response = await camionesService.getCamiones();
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('Camiones cargados:', response.data);
        console.log('Primer camión:', response.data[0]);
        setCamiones(response.data);
      } else {
        setError("Error al cargar los camiones");
      }
    } catch (error) {
      console.error("Error cargando camiones:", error);
      setError("Error al cargar los camiones: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionChange = (e, camion) => {
    const action = e.target.value;
    console.log('Acción seleccionada:', action, 'Camión:', camion);
    e.target.value = "";
    if (action === "editar") {
      navigate(`/editar-camiones/${camion.id}`);
    } else if (action === "mostrar") {
      navigate(`/ver-camiones/${camion.id}`);
    } else if (action === "eliminar") {
      console.log('Configurando eliminación para camión:', camion);
      setCamionToDelete(camion);
      setModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log('Eliminando camión:', camionToDelete.id);
      const response = await camionesService.deleteCamion(camionToDelete.id);
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        setCamiones(prev => prev.filter(c => c.id !== camionToDelete.id));
        setModalVisible(false);
        setCamionToDelete(null);
        setError(''); // Limpiar errores anteriores
        setSuccessMessage('Camión eliminado con éxito');
        setShowSuccessModal(true);
      } else {
        setError(response.message || 'Error al eliminar el camión');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al eliminar el camión');
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setCamionToDelete(null);
  };

  const camionesFiltrados = camiones.filter(c =>
    c.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.color.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCamiones = camionesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(camionesFiltrados.length / itemsPerPage);

  if (loading) {
    return (
      <div className="reutilizar-container">
        <h2>Camiones</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando camiones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reutilizar-container">
        <h2>Camiones</h2>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={cargarCamiones} className="reutilizar-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  console.log('Estado del modal:', { modalVisible, camionToDelete });

  return (
    <div className="reutilizar-container">
      <h2>Camiones</h2>

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
          datos de {camionesFiltrados.length}
        </div>

        <div className="reutilizar-search-center">
          <label htmlFor="busqueda">Búsqueda:</label>
          <input
            type="text"
            id="busqueda"
            placeholder="Buscar camión..."
            className="reutilizar-search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div>
          <button
            className="reutilizar-button ingresar-btn"
            onClick={() => navigate("/ingresar-camiones")}
          >
            + Ingresar Camión
          </button>
        </div>
      </div>

      <table className="reutilizar-table">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Color</th>
            <th>Tipo</th>
            <th>Tarjeta de circulación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCamiones.map((camion) => {
            console.log('Renderizando camión:', camion);
            return (
            <tr key={camion.id}>
              <td>{camion.placa}</td>
              <td>{camion.marca}</td>
              <td>{camion.modelo}</td>
              <td>{camion.color}</td>
              <td>{camion.tipo}</td>
              <td>{camion.tarjeta_circulacion || 'N/A'}</td>
              <td>
                <select onChange={(e) => handleActionChange(e, camion)} className="reutilizar-select">
                  <option value="">Seleccionar</option>
                  <option value="editar">Editar</option>
                  <option value="mostrar">Mostrar</option>
                  <option value="eliminar">Eliminar</option>
                </select>
              </td>
            </tr>
            );
          })}
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
            <p>¿Deseas eliminar el camión con placa {camionToDelete?.placa}?</p>
            <div className="modal-buttons">
              <button className="form-button" onClick={confirmDelete}>Sí</button>
              <button className="close-button" onClick={cancelDelete}>No</button>
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
