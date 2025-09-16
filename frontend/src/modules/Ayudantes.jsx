import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reutilizar.css";

export default function Ayudantes() {
  const [ayudantes, setAyudantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [ayudanteToDelete, setAyudanteToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      { id: 1, nombre: "Pedro", apellido: "Santos", telefono: "+502 5551-2001", rol: "Ayudante" },
      { id: 2, nombre: "Carla", apellido: "Morales", telefono: "+502 5551-2002", rol: "Ayudante" },
      { id: 3, nombre: "Andrés", apellido: "Lopez", telefono: "+502 5551-2003", rol: "Ayudante" },
      { id: 4, nombre: "Luciana", apellido: "Ramírez", telefono: "+502 5551-2004", rol: "Ayudante" },
      { id: 5, nombre: "Jorge", apellido: "Hernández", telefono: "+502 5551-2005", rol: "Ayudante" },
      { id: 6, nombre: "Sofía", apellido: "Gutiérrez", telefono: "+502 5551-2006", rol: "Ayudante" },
    ];
    setAyudantes(data);
  }, []);

  const handleActionChange = (e, ayudante) => {
    const action = e.target.value;
    e.target.value = "";

    if (action === "editar") {
      navigate(`/editar-ayudantes/${ayudante.id}`, { state: { ayudante } });
    } else if (action === "mostrar") {
      navigate(`/mostrar-ayudante/${ayudante.id}`);
    } else if (action === "eliminar") {
      setAyudanteToDelete(ayudante);
      setModalVisible(true);
    }
  };

  const confirmDelete = () => {
    setAyudantes(prev => prev.filter(a => a.id !== ayudanteToDelete.id));
    setModalVisible(false);
    alert("Ayudante eliminado (simulado)");
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

  return (
    <div className="reutilizar-container">
      <h2>Ayudantes</h2>

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
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentAyudantes.map((ayudante) => (
            <tr key={ayudante.id}>
              <td>{ayudante.nombre}</td>
              <td>{ayudante.apellido}</td>
              <td>{ayudante.telefono}</td>
              <td>{ayudante.rol}</td>
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
