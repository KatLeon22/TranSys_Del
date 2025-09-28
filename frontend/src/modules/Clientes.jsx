// src/modules/Clientes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientesService from "../services/clientesService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/reutilizar.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await clientesService.getClientes();

      if (response.success) {
        const clientesFormateados = response.data.map(cliente => ({
          id: cliente.id,
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          telefono: cliente.telefono || '',
          rutas_asignadas: cliente.rutas_asignadas || 0
        }));
        setClientes(clientesFormateados);
      } else {
        setError('Error al cargar los clientes');
      }
    } catch (error) {
      setError('Error al cargar los clientes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionChange = (e, cliente) => {
    const action = e.target.value;
    e.target.value = ""; // Reset del select
    if (action === "editar") {
      navigate(`/editar-clientes/${cliente.id}`); // Ahora va a la ruta de editar
    } else if (action === "mostrar") {
      navigate(`/ver-clientes/${cliente.id}`);
    } else if (action === "eliminar") {
      setClienteToDelete(cliente);
      setModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await clientesService.deleteCliente(clienteToDelete.id);

      if (response.success) {
        setClientes(prev => prev.filter(c => c.id !== clienteToDelete.id));
        setModalVisible(false);
        setClienteToDelete(null);
        setSuccessMessage('Cliente eliminado con éxito');
        setShowSuccessModal(true);
      } else {
        setError('Error al eliminar el cliente');
      }
    } catch (error) {
      setError('Error al eliminar el cliente');
      console.error('Error:', error);
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setClienteToDelete(null);
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.apellido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = clientesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);

  if (loading) {
    return (
      <div className="reutilizar-container">
        <h2>Clientes</h2>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Cargando clientes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reutilizar-container">
        <h2>Clientes</h2>
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          <p>{error}</p>
          <button onClick={cargarClientes} className="reutilizar-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reutilizar-container">
      <h2>Clientes</h2>

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
          datos de {clientesFiltrados.length}
        </div>

        <div className="reutilizar-search-center">
          <label htmlFor="busqueda">Búsqueda:</label>
          <input
            type="text"
            id="busqueda"
            placeholder="Buscar cliente..."
            className="reutilizar-search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div>
          <button
            className="reutilizar-button ingresar-btn"
            onClick={() => navigate("/ingresar-clientes")}
          >
            + Ingresar Clientes
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
          {currentClientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{cliente.telefono}</td>
              <td>
                <select onChange={(e) => handleActionChange(e, cliente)} className="reutilizar-select">
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
            <p>¿Deseas eliminar a {clienteToDelete.nombre} {clienteToDelete.apellido}?</p>
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
