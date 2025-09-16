// src/modules/Camiones.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reutilizar.css";

export default function Camiones() {
  const [camiones, setCamiones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [camionToDelete, setCamionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      { id: 1, placa: "P-123FDS", marca: "Freightliner", modelo: "Cascadia", color: "Blanco", tipo: "Tráiler" },
      { id: 2, placa: "P-456ASD", marca: "Kenworth", modelo: "T680", color: "Azul", tipo: "Camión pesado" },
      { id: 3, placa: "P-789QWE", marca: "Volvo", modelo: "VNL", color: "Rojo", tipo: "Tráiler" },
      { id: 4, placa: "P-321RTY", marca: "International", modelo: "LT", color: "Negro", tipo: "Camión mediano" },
      { id: 5, placa: "P-654FGH", marca: "Mack", modelo: "Anthem", color: "Gris", tipo: "Tráiler" },
      { id: 6, placa: "P-987JKL", marca: "Mercedes", modelo: "Actros", color: "Blanco", tipo: "Camión pesado" },
    ];
    setCamiones(data);
  }, []);

  const handleActionChange = (e, camion) => {
    const action = e.target.value;
    e.target.value = ""; // Reset del select
    if (action === "editar") {
      navigate(`/editar-camiones/${camion.id}`);
    } else if (action === "mostrar") {
      navigate(`/ver-camiones/${camion.id}`);
    } else if (action === "eliminar") {
      setCamionToDelete(camion);
      setModalVisible(true);
    }
  };

  const confirmDelete = () => {
    setCamiones(prev => prev.filter(c => c.id !== camionToDelete.id));
    setModalVisible(false);
    alert("Camión eliminado (simulado)");
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

  return (
    <div className="reutilizar-container">
      <h2>Camiones</h2>

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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCamiones.map((camion) => (
            <tr key={camion.id}>
              <td>{camion.placa}</td>
              <td>{camion.marca}</td>
              <td>{camion.modelo}</td>
              <td>{camion.color}</td>
              <td>{camion.tipo}</td>
              <td>
                <select onChange={(e) => handleActionChange(e, camion)} className="reutilizar-select">
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
            <p>¿Deseas eliminar el camión con placa {camionToDelete.placa}?</p>
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
