// src/modules/Choferes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import choferesService from "../services/choferesService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/reutilizar.css";

export default function Choferes() {
  const [choferes, setChoferes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [choferToDelete, setChoferToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    cargarChoferes();
  }, []);

  const cargarChoferes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Cargando choferes...');
      const response = await choferesService.getChoferes();
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('Datos recibidos:', response.data);
        const choferesFormateados = response.data.map(chofer => ({
          id: chofer.id,
          nombre: chofer.nombre,
          apellido: chofer.apellido,
          telefono: chofer.telefono || '',
          tipoLicencia: chofer.tipo_licencia || '',
          fechaVencimiento: chofer.vencimiento || '',
          username: chofer.username || '',
          rol_nombre: chofer.rol_nombre || ''
        }));
        console.log('Choferes formateados:', choferesFormateados);
        setChoferes(choferesFormateados);
      } else {
        console.error('Error en la respuesta:', response.message);
        setError('Error al cargar los choferes: ' + response.message);
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError('Error al cargar los choferes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Acción de los combobox
  const handleActionChange = (e, chofer) => {
    const action = e.target.value;
    e.target.value = ""; // reset del select

    if (action === "editar") {
      navigate(`/editar-choferes/${chofer.id}`, { state: { chofer } }); // enviar chofer al editar
    } else if (action === "mostrar") {
      navigate(`/mostrar-choferes/${chofer.id}`, { state: { chofer } }); // enviar chofer al mostrar
    } else if (action === "eliminar") {
      setChoferToDelete(chofer);
      setModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log('Eliminando chofer:', choferToDelete.id);
      const response = await choferesService.deleteChofer(choferToDelete.id);
      console.log('Respuesta del servicio:', response);
      
      if (response.success) {
        setChoferes(prev => prev.filter(c => c.id !== choferToDelete.id));
        setModalVisible(false);
        setChoferToDelete(null);
        setError(''); // Limpiar errores anteriores
        setSuccessMessage('Chofer eliminado con éxito');
        setShowSuccessModal(true);
      } else {
        setError(response.message || 'Error al eliminar el chofer');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al eliminar el chofer');
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setChoferToDelete(null);
  };

  // Filtrado
  const choferesFiltrados = choferes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.apellido.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChoferes = choferesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(choferesFiltrados.length / itemsPerPage);

  if (loading) {
    return (
      <div className="reutilizar-container">
        <h2>Pilotos</h2>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando pilotos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reutilizar-container">
        <h2>Pilotos</h2>
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          <p>{error}</p>
          <button onClick={cargarChoferes} className="btn-primary">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reutilizar-container">
      <h2>Pilotos</h2>

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
          datos de {choferesFiltrados.length}
        </div>

        <div className="reutilizar-search-center">
          <label htmlFor="busqueda">Búsqueda:</label>
          <input
            type="text"
            id="busqueda"
            placeholder="Buscar piloto..."
            className="reutilizar-search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div>
          <button
            className="reutilizar-button ingresar-btn"
            onClick={() => navigate("/ingresar-choferes")}
          >
            + Ingresar Piloto
          </button>
        </div>
      </div>

      <table className="reutilizar-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Tipo de Licencia</th>
            <th>Fecha de Vencimiento<br />de Licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentChoferes.map((chofer) => (
            <tr key={chofer.id}>
              <td>{chofer.nombre}</td>
              <td>{chofer.apellido}</td>
              <td>{chofer.telefono}</td>
              <td>{chofer.tipoLicencia}</td>
              <td>{chofer.fechaVencimiento ? new Date(chofer.fechaVencimiento).toLocaleDateString('es-ES') : 'N/A'}</td>
              <td>
                <select onChange={(e) => handleActionChange(e, chofer)} className="reutilizar-select">
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
            <p>¿Deseas eliminar a {choferToDelete.nombre} {choferToDelete.apellido}?</p>
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
