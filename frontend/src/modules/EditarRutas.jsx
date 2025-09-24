// src/modules/EditarRutas.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import rutaService from "../services/rutaService.js";
import clientesService from "../services/clientesService.js";
import "../styles/editar-rutas.css";
import Logo from "../assets/logo.png";

export default function EditarRutas() {
  const navigate = useNavigate();
  const { id } = useParams();
  const rutaId = parseInt(id);

  const [formData, setFormData] = useState({
    noRuta: "",
    cliente: "",
    servicio: "",
    mercaderia: "",
    camion: "",
    combustible: "",
    chofer: "",
    ayudante: "",
    origen: "",
    destino: "",
    fecha: "",
    hora: "",
    precio: "",
    comentario: "",
    estado: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [choferesDisponibles, setChoferesDisponibles] = useState([]);
  const [ayudantesDisponibles, setAyudantesDisponibles] = useState([]);
  const [camionesDisponibles, setCamionesDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [showClientesList, setShowClientesList] = useState(false);
  const estados = ["Pendiente", "En curso", "Entregado", "Incidente"];

  useEffect(() => {
    cargarDatos();
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showClientesList && !event.target.closest('.cliente-combobox-container')) {
        setShowClientesList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClientesList]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar datos de la ruta específica y datos de referencia
      const [rutaRes, choferesRes, camionesRes, clientesRes, ayudantesRes] = await Promise.all([
        rutaService.getRutaById(rutaId),
        rutaService.getChoferes(),
        rutaService.getCamiones(),
        rutaService.getClientes(),
        rutaService.getAyudantes()
      ]);

      if (rutaRes.success) {
        const ruta = rutaRes.data;
        console.log('Datos de la ruta recibidos:', ruta);
        console.log('Fecha original:', ruta.fecha);
        
        // Formatear la fecha para el input type="date"
        const fechaFormateada = ruta.fecha ? new Date(ruta.fecha).toISOString().split('T')[0] : '';
        console.log('Fecha formateada:', fechaFormateada);
        
        setFormData({
          noRuta: ruta.no_ruta || '',
          cliente: ruta.cliente_nombre || '',
          servicio: ruta.servicio || '',
          mercaderia: ruta.mercaderia || '',
          camion: ruta.camion_placa || '',
          combustible: ruta.combustible || '',
          chofer: ruta.chofer_nombre || '',
          ayudante: ruta.ayudante_nombre || '',
          origen: ruta.origen || '',
          destino: ruta.destino || '',
          fecha: fechaFormateada,
          hora: ruta.hora || '',
          precio: ruta.precio || '',
          comentario: ruta.comentario || '',
          estado: ruta.estado || '',
        });
        
        console.log('FormData establecido:', {
          noRuta: ruta.no_ruta || '',
          cliente: ruta.cliente_nombre || '',
          fecha: fechaFormateada,
          // ... otros campos
        });
      } else {
        setError('Error al cargar los datos de la ruta');
      }

      if (choferesRes.success) {
        setChoferesDisponibles(choferesRes.data);
      }
      if (camionesRes.success) {
        setCamionesDisponibles(camionesRes.data);
      }
      if (clientesRes.success) {
        setClientesDisponibles(clientesRes.data);
      }
      if (ayudantesRes.success) {
        setAyudantesDisponibles(ayudantesRes.data);
      }
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Buscar cliente existente o crear nuevo
      let clienteId = clientesDisponibles.find(c => c.nombre === formData.cliente)?.id;
      if (!clienteId && formData.cliente.trim()) {
        const nombreCompleto = formData.cliente.trim();
        const partesNombre = nombreCompleto.split(' ');
        const nombre = partesNombre[0] || nombreCompleto;
        const apellido = partesNombre.slice(1).join(' ') || 'Cliente';
        
        const nuevoCliente = await clientesService.createCliente({
          nombre: nombre,
          apellido: apellido,
          telefono: ''
        });
        
        if (nuevoCliente.success) {
          clienteId = nuevoCliente.data.id;
        } else {
          throw new Error('Error al crear el cliente');
        }
      }

      // Preparar datos para actualizar
      const rutaData = {
        no_ruta: formData.noRuta,
        cliente_id: clienteId,
        servicio: formData.servicio,
        mercaderia: formData.mercaderia,
        camion_id: camionesDisponibles.find(c => c.placa === formData.camion)?.id,
        combustible: formData.combustible,
        origen: formData.origen,
        destino: formData.destino,
        chofer_id: choferesDisponibles.find(c => c.nombre === formData.chofer)?.id,
        ayudante_id: ayudantesDisponibles.find(a => a.nombre === formData.ayudante)?.id,
        fecha: formData.fecha,
        hora: formData.hora,
        precio: formData.precio,
        comentario: formData.comentario,
        estado: formData.estado
      };

      const response = await rutaService.updateRuta(rutaId, rutaData);
      
      if (response.success) {
        alert('Ruta actualizada exitosamente');
        navigate("/rutas");
      } else {
        setError(response.message || 'Error al actualizar la ruta');
      }
    } catch (error) {
      setError('Error al actualizar la ruta');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ingresar-ruta-wrapper">
        <div className="ingresar-ruta-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos de la ruta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ingresar-ruta-wrapper">
        <div className="ingresar-ruta-container">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => navigate("/rutas")} className="form-button">
              Volver a Rutas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ingresar-ruta-wrapper">
      <div className="ingresar-ruta-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-ruta-title">Editar Ruta</h2>
        {console.log('FormData actual en render:', formData)}

        <form className="ingresar-ruta-form" onSubmit={handleSubmit}>
          {/* No. de Ruta */}
          <div className="form-group full-width">
            <label>No. de Ruta:</label>
            <input type="text" name="noRuta" value={formData.noRuta} onChange={handleChange} required />
          </div>

          {/* Cliente y Servicio */}
          <div className="form-row">
            <div className="form-group">
              <label>Cliente:</label>
              <div className="cliente-combobox-container">
                <div className="cliente-input-wrapper">
                  <input 
                    type="text" 
                    name="cliente" 
                    value={formData.cliente} 
                    onChange={handleChange} 
                    onFocus={() => setShowClientesList(true)}
                    placeholder="Seleccionar cliente o escribir nuevo..."
                    className="cliente-combobox-input"
                    required
                  />
                  <button 
                    type="button" 
                    className="cliente-dropdown-btn"
                    onClick={() => setShowClientesList(!showClientesList)}
                  >
                    ▼
                  </button>
                </div>
                
                {showClientesList && (
                  <div className="cliente-dropdown">
                    <div className="cliente-dropdown-header">
                      <span>Clientes disponibles</span>
                    </div>
                    
                    <div className="cliente-options">
                      {clientesDisponibles.map(cliente => (
                        <div 
                          key={cliente.id} 
                          className={`cliente-option ${formData.cliente === cliente.nombre ? 'selected' : ''}`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, cliente: cliente.nombre }));
                            setShowClientesList(false);
                          }}
                        >
                          <div className="cliente-option-name">{cliente.nombre}</div>
                          {cliente.id === 'nuevo' && (
                            <span className="cliente-new-badge">Nuevo</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Servicio:</label>
              <input type="text" name="servicio" value={formData.servicio} onChange={handleChange} required />
            </div>
          </div>

          {/* Mercadería y Camión */}
          <div className="form-row">
            <div className="form-group">
              <label>Mercadería:</label>
              <input type="text" name="mercaderia" value={formData.mercaderia} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Camión:</label>
              <select name="camion" value={formData.camion} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {camionesDisponibles.map(c => <option key={c.id} value={c.placa}>{c.placa}</option>)}
              </select>
            </div>
          </div>

          {/* Combustible y Chofer */}
          <div className="form-row">
            <div className="form-group">
              <label>Combustible (gal.):</label>
              <input type="number" name="combustible" value={formData.combustible} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Chofer:</label>
              <select name="chofer" value={formData.chofer} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {choferesDisponibles.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          {/* Ayudante y Origen */}
          <div className="form-row">
            <div className="form-group">
              <label>Ayudante:</label>
              <select name="ayudante" value={formData.ayudante} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {ayudantesDisponibles.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Origen:</label>
              <input type="text" name="origen" value={formData.origen} onChange={handleChange} required />
            </div>
          </div>

          {/* Destino y Fecha */}
          <div className="form-row">
            <div className="form-group">
              <label>Destino:</label>
              <input type="text" name="destino" value={formData.destino} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Fecha:</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
            </div>
          </div>

          {/* Hora y Precio */}
          <div className="form-row">
            <div className="form-group">
              <label>Hora (ETA):</label>
              <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Precio del viaje (Q):</label>
              <input type="number" name="precio" value={formData.precio} onChange={handleChange} min="0" required />
            </div>
          </div>

          {/* Comentario */}
          <div className="form-group full-width">
            <label>Comentario:</label>
            <textarea name="comentario" value={formData.comentario} onChange={handleChange} rows={3} placeholder="Agregar un comentario..." />
          </div>

          {/* Estado */}
          <div className="form-group full-width">
            <label>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="form-button ingresar-btn" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button type="button" className="close-button" onClick={() => navigate("/rutas")} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
