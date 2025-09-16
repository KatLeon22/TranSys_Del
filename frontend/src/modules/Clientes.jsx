// src/modules/Clientes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reutilizar.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      { id: 1, nombre: "Juan", apellido: "Pérez", telefono: "+502 5551-3001" },
      { id: 2, nombre: "Laura", apellido: "García", telefono: "+502 5551-3002" },
      { id: 3, nombre: "Pedro", apellido: "Martínez", telefono: "+502 5551-3003" },
      { id: 4, nombre: "Ana", apellido: "Santos", telefono: "+502 5551-3004" },
      { id: 5, nombre: "Carlos", apellido: "Ramírez", telefono: "+502 5551-3005" },
      { id: 6, nombre: "Sofía", apellido: "López", telefono: "+502 5551-3006" },
    ];
    setClientes(data);
  }, []);

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

  const confirmDelete = () => {
    setClientes(prev => prev.filter(c => c.id !== clienteToDelete.id));
    setModalVisible(false);
    alert("Cliente eliminado (simulado)");
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
    </div>
  );
}
