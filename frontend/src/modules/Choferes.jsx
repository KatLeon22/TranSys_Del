// src/modules/Choferes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reutilizar.css";

export default function Choferes() {
  const [choferes, setChoferes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [choferToDelete, setChoferToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      { id: 1, nombre: "José", apellido: "Ramírez", telefono: "+502 5551-1003", rol: "Conductor", tipoLicencia: "C" },
      { id: 2, nombre: "María", apellido: "López", telefono: "+502 5551-1004", rol: "Conductor", tipoLicencia: "B" },
      { id: 3, nombre: "Luis", apellido: "Gómez", telefono: "+502 5551-1005", rol: "Conductor", tipoLicencia: "C" },
      { id: 4, nombre: "Ana", apellido: "Martínez", telefono: "+502 5551-1006", rol: "Conductor", tipoLicencia: "B" },
      { id: 5, nombre: "Carlos", apellido: "Ramírez", telefono: "+502 5551-1007", rol: "Conductor", tipoLicencia: "C" },
      { id: 6, nombre: "Lucía", apellido: "Hernández", telefono: "+502 5551-1008", rol: "Conductor", tipoLicencia: "B" },
    ];
    setChoferes(data);
  }, []);

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

  const confirmDelete = () => {
    setChoferes(prev => prev.filter(c => c.id !== choferToDelete.id));
    setModalVisible(false);
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
            <th>Rol</th>
            <th>Tipo de Licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentChoferes.map((chofer) => (
            <tr key={chofer.id}>
              <td>{chofer.nombre}</td>
              <td>{chofer.apellido}</td>
              <td>{chofer.telefono}</td>
              <td>{chofer.rol}</td>
              <td>{chofer.tipoLicencia}</td>
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
    </div>
  );
}
