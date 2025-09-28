// src/modules/IngresarRutas.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rutaService from "../services/rutaService.js";
import clientesService from "../services/clientesService.js";
import PopUp from "../components/PopUp.jsx";
import "../styles/ingresar-rutas.css";
import Logo from "../assets/logo.png";

export default function IngresarRutas() {
  const navigate = useNavigate();
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
  const [nextRutaNumber, setNextRutaNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [choferesDisponibles, setChoferesDisponibles] = useState([]);
  const [ayudantesDisponibles, setAyudantesDisponibles] = useState([]);
  const [camionesDisponibles, setCamionesDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const estados = ["Pendiente", "En curso", "Entregado", "Incidente"];

  useEffect(() => {
    cargarDatos();
  }, []);


  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar todos los datos necesarios
      const [nextNumberRes, choferesRes, camionesRes, clientesRes, ayudantesRes] = await Promise.all([
        rutaService.getNextRutaNumber(),
        rutaService.getChoferes(),
        rutaService.getCamiones(),
        rutaService.getClientes(),
        rutaService.getAyudantes()
      ]);
      
      // Procesar siguiente número de ruta
      if (nextNumberRes.success) {
        setNextRutaNumber(nextNumberRes.data.nextRutaNumber);
        setFormData(prev => ({ ...prev, noRuta: nextNumberRes.data.nextRutaNumber }));
      }
      
      // Procesar choferes
      if (choferesRes.success) {
        setChoferesDisponibles(choferesRes.data.map(c => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido}`
        })));
      }
      
      // Procesar camiones
      if (camionesRes.success) {
        setCamionesDisponibles(camionesRes.data.map(c => ({
          id: c.id,
          placa: c.placa
        })));
      }
      
      // Procesar clientes
      if (clientesRes.success) {
        setClientesDisponibles(clientesRes.data.map(c => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido}`
        })));
      }
      
      // Procesar ayudantes
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Buscar cliente existente
      const clienteId = clientesDisponibles.find(c => c.nombre === formData.cliente)?.id;
      
      // Validar que el cliente exista
      if (!clienteId) {
        setError('Cliente no encontrado. Verifica que el cliente seleccionado sea válido.');
        return;
      }

      // Preparar datos para la API
      const camionId = camionesDisponibles.find(c => c.placa === formData.camion)?.id;
      const choferId = choferesDisponibles.find(c => c.nombre === formData.chofer)?.id;
      const ayudanteId = ayudantesDisponibles.find(a => a.nombre === formData.ayudante)?.id;
      
      console.log('IDs encontrados:', {
        clienteId,
        camionId,
        choferId,
        ayudanteId
      });
      
      // Validar que los IDs requeridos existan
      if (!camionId) {
        setError('Camión no encontrado. Verifica que el camión seleccionado sea válido.');
        return;
      }
      
      if (!choferId) {
        setError('Chofer no encontrado. Verifica que el chofer seleccionado sea válido.');
        return;
      }
      
      const rutaData = {
        no_ruta: formData.noRuta,
        cliente_id: clienteId,
        servicio: formData.servicio,
        mercaderia: formData.mercaderia,
        camion_id: camionId,
        combustible: parseFloat(formData.combustible) || null,
        origen: formData.origen,
        destino: formData.destino,
        chofer_id: choferId,
        ayudante_id: ayudanteId || null,
        fecha: formData.fecha,
        hora: formData.hora,
        precio: parseFloat(formData.precio) || null,
        comentario: formData.comentario,
        estado: formData.estado || 'Pendiente'
      };
      
      console.log('Datos a enviar:', rutaData);
      
      // Crear la ruta usando el servicio
      const response = await rutaService.createRuta(rutaData);
      
      if (response.success) {
        setSuccessMessage('La ruta ha sido creada exitosamente');
        setShowSuccessModal(true);
        // Limpiar formulario
        setFormData({
          noRuta: nextRutaNumber,
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
          estado: "Pendiente",
        });
      } else {
        setError(response.message || 'Error al crear la ruta');
      }
      
    } catch (error) {
      console.error('Error creando ruta:', error);
      setError('Error al crear la ruta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ingresar-ruta-wrapper">
      <div className="ingresar-ruta-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo Empresa" className="logo" />
        </div>

        <h2 className="ingresar-ruta-title">Ingresar Ruta</h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Cargando datos...
          </div>
        )}

        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '15px', 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form className="ingresar-ruta-form" onSubmit={handleSubmit}>

          {/* No. de Ruta */}
          <div className="form-group full-width">
            <label>No. de Ruta:</label>
            <div className="ruta-number-container">
              <input 
                type="text" 
                name="noRuta" 
                value={formData.noRuta} 
                onChange={handleChange} 
                required 
                className="ruta-number-input"
              />
              {nextRutaNumber && (
                <div className="next-number-indicator">
                  <span className="indicator-label">Siguiente:</span>
                  <span className="indicator-value">{nextRutaNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cliente y Servicio */}
          <div className="form-row">
            <div className="form-group">
              <label>Cliente:</label>
              <select name="cliente" value={formData.cliente} onChange={handleChange} required>
                <option value="">Seleccionar cliente</option>
                {clientesDisponibles.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
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
              <select name="ayudante" value={formData.ayudante} onChange={handleChange}>
                <option value="">Seleccionar (opcional)</option>
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
            <button 
              type="submit" 
              className="form-button ingresar-btn" 
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Ingresar'}
            </button>
            <button 
              type="button" 
              className="close-button" 
              onClick={() => navigate("/rutas")}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
      
      {/* PopUp de éxito */}
      <PopUp
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/rutas");
        }}
        message={successMessage}
        type="success"
      />
    </div>
  );
}
