import React, { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';
import PopUp from '../components/PopUp';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true); // Mostrar formulario por defecto
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUserList, setShowUserList] = useState(false); // Nueva variable para mostrar lista
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [pilotos, setPilotos] = useState([]);
  const [loadingPilotos, setLoadingPilotos] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showViewPasswordModal, setShowViewPasswordModal] = useState(false);
  const [selectedUserForViewPassword, setSelectedUserForViewPassword] = useState(null);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [tempPermissions, setTempPermissions] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rol_id: '',
    estado: 'activo',
    piloto_id: '',
    permisos: []
  });

  // Lista de permisos disponibles
  const permisosDisponibles = [
    { id: 1, nombre: 'crear_rutas', descripcion: 'Permite crear nuevas rutas' },
    { id: 2, nombre: 'editar_rutas', descripcion: 'Permite editar rutas existentes' },
    { id: 3, nombre: 'eliminar_rutas', descripcion: 'Permite eliminar rutas' },
    { id: 4, nombre: 'ver_rutas', descripcion: 'Permite ver rutas' },
    { id: 5, nombre: 'cambiar_estado', descripcion: 'Permite cambiar estado de rutas' },
    { id: 6, nombre: 'gestionar_catalogos', descripcion: 'Permite añadir clientes, camiones, pilotos, ayudantes' },
    { id: 7, nombre: 'generar_reportes', descripcion: 'Permite generar reportes del sistema' }
  ];

  useEffect(() => {
    loadData();
    loadPilotos();
  }, []);


  const loadPilotos = async () => {
    try {
      setLoadingPilotos(true);
      console.log('🔄 Cargando pilotos desde API...');
      const response = await fetch('http://localhost:4000/api/piloto');
      console.log('📡 Respuesta recibida:', response.status);
      const data = await response.json();
      console.log('📋 Datos de pilotos:', data);
      if (data.success) {
        setPilotos(data.data);
        console.log('✅ Pilotos cargados exitosamente:', data.data.length, 'pilotos');
      } else {
        console.error('❌ Error en respuesta de pilotos:', data);
        showMessage('Error cargando pilotos', 'error');
      }
    } catch (error) {
      console.error('❌ Error cargando pilotos:', error);
      showMessage('Error cargando pilotos', 'error');
    } finally {
      setLoadingPilotos(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const usuariosData = await usuariosService.getAll();
      console.log('📋 Datos recibidos:', usuariosData);
      
      // Verificar que sea un array
      if (Array.isArray(usuariosData)) {
        // Ordenar usuarios por ID de forma ascendente
        const sortedData = usuariosData.sort((a, b) => a.id - b.id);
        setUsuarios(sortedData);
      } else if (usuariosData && Array.isArray(usuariosData.data)) {
        // Ordenar usuarios por ID de forma ascendente
        const sortedData = usuariosData.data.sort((a, b) => a.id - b.id);
        setUsuarios(sortedData);
      } else {
        console.error('❌ Formato de datos inesperado:', usuariosData);
        setUsuarios([]);
        showMessage('Error: formato de datos inesperado', 'error');
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsuarios([]);
      showMessage('Error cargando usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message, type) => {
    console.log('🔔 Mostrando mensaje:', message, 'Tipo:', type);
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    console.log('🔔 Estado showPopup:', true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (rolId) => {
    setFormData(prev => ({
      ...prev,
      rol_id: rolId,
      piloto_id: rolId === '2' ? prev.piloto_id : '', // Mantener piloto_id solo si es piloto
      permisos: rolId === '1' ? [1, 2, 3, 4, 5, 6, 7] : rolId === '2' ? [4, 5] : [] // Asignar permisos por defecto según rol (Usuario sin permisos predefinidos)
    }));
  };

  const handlePermissionChange = (permisoId, isChecked) => {
    setTempPermissions(prev => 
      isChecked 
        ? [...prev, permisoId]
        : prev.filter(id => id !== permisoId)
    );
  };

  const handleOpenPermissionsModal = () => {
    setTempPermissions([...formData.permisos]);
    setShowPermissionsModal(true);
  };

  const handleClosePermissionsModal = () => {
    setShowPermissionsModal(false);
    setTempPermissions([]);
  };

  const handleSavePermissions = () => {
    setFormData(prev => ({
      ...prev,
      permisos: [...tempPermissions]
    }));
    setShowPermissionsModal(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🔄 Iniciando creación de usuario...');
      console.log('📋 Datos del formulario:', formData);
      
      if (showEditForm) {
        console.log('✏️ Actualizando usuario...');
        await usuariosService.update(selectedUser.id, formData);
        showMessage('Usuario actualizado exitosamente', 'success');
      } else {
        console.log('➕ Creando nuevo usuario...');
        const result = await usuariosService.create(formData);
        console.log('✅ Usuario creado exitosamente:', result);
        showMessage('Usuario creado exitosamente', 'success');
      }
      
      resetForm();
      loadData();
    } catch (error) {
      console.error('❌ Error guardando usuario:', error);
      console.error('📋 Detalles del error:', error.response?.data || error.message);
      showMessage(`Error guardando usuario: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormData({
      username: usuario.username,
      password: '',
      rol_id: usuario.rol_id,
      estado: usuario.estado || 'activo',
      piloto_id: usuario.piloto_id || '',
      permisos: [] // Se cargarán los permisos del usuario si es necesario
    });
    setShowEditForm(true);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    setConfirmData({ id, usuario });
    setConfirmAction('delete');
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await usuariosService.delete(confirmData.id);
      showMessage('Usuario eliminado exitosamente', 'delete');
      loadData();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      showMessage('Error eliminando usuario', 'error');
    }
  };


  const handleEditPassword = (usuario) => {
    setSelectedUserForPassword(usuario);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handleViewPassword = (usuario) => {
    setSelectedUserForViewPassword(usuario);
    setShowViewPasswordModal(true);
  };

  const updateUserPassword = async (userId, newPassword) => {
    try {
      console.log('🔄 Actualizando contraseña para usuario:', userId);
      console.log('🔐 Nueva contraseña:', newPassword);
      
      // Enviar solo la contraseña, el backend mantendrá los otros campos
      const result = await usuariosService.update(userId, { 
        password: newPassword
      });
      console.log('✅ Resultado de actualización:', result);
      
      showMessage('Contraseña actualizada exitosamente', 'success');
      loadData();
    } catch (error) {
      console.error('❌ Error actualizando contraseña:', error);
      console.error('📋 Detalles del error:', error.response?.data || error.message);
      showMessage(`Error actualizando contraseña: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword.trim()) {
      showMessage('Por favor ingresa una contraseña', 'error');
      return;
    }
    
    try {
      await updateUserPassword(selectedUserForPassword.id, newPassword.trim());
      setShowPasswordModal(false);
      setSelectedUserForPassword(null);
      setNewPassword('');
    } catch (error) {
      console.error('Error guardando contraseña:', error);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordModal(false);
    setSelectedUserForPassword(null);
    setNewPassword('');
  };

  const handleCloseViewPassword = () => {
    setShowViewPasswordModal(false);
    setSelectedUserForViewPassword(null);
  };

  const handleShowUsers = () => {
    setShowUsersModal(true);
  };

  const handleCloseUsers = () => {
    setShowUsersModal(false);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await usuariosService.changeStatus(userId, newStatus);
      showMessage(`Usuario ${newStatus === 'activo' ? 'activado' : 'desactivado'} exitosamente`, 'edit');
      loadData();
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      showMessage('Error cambiando estado del usuario', 'error');
    }
  };

  const handleChangeStatus = (usuario) => {
    const newStatus = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    const action = newStatus === 'activo' ? 'activar' : 'desactivar';
    
    setConfirmData({ usuario, newStatus, action });
    setConfirmAction('changeStatus');
    setShowConfirmDialog(true);
  };

  const handleConfirmChangeStatus = async () => {
    try {
      await usuariosService.changeStatus(confirmData.usuario.id, confirmData.newStatus);
      showMessage(`Usuario ${confirmData.action}do exitosamente`, 'success');
      loadData();
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      showMessage('Error cambiando estado del usuario', 'error');
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'delete') {
      handleConfirmDelete();
    } else if (confirmAction === 'changeStatus') {
      handleConfirmChangeStatus();
    }
  };

  const getConfirmDialogProps = () => {
    if (confirmAction === 'delete') {
      return {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar al usuario "${confirmData?.usuario?.username}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      };
    } else if (confirmAction === 'changeStatus') {
      return {
        title: 'Confirmar cambio de estado',
        message: `¿Estás seguro de que quieres ${confirmData?.action} al usuario "${confirmData?.usuario?.username}"?`,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar'
      };
    }
    return {
      title: 'Confirmar acción',
      message: '¿Estás seguro de que quieres realizar esta acción?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar'
    };
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      rol_id: '',
      estado: 'activo',
      piloto_id: '',
      permisos: []
    });
    setShowForm(true);
    setShowEditForm(false);
    setShowUserList(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>Gestión de Usuarios</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            loadData();
            handleShowUsers();
          }}
        >
          Mostrar Usuarios
        </button>
      </div>

      {/* Formulario de creación/edición */}
      {showForm && (
        <div className="main-form-container">
          <h2>{showEditForm ? 'Editar Usuario' : 'Crear Usuario'}</h2>
            
            <form onSubmit={handleSubmit} className="usuario-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de Usuario:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!showEditForm}
                    placeholder={showEditForm ? "Dejar vacío para mantener actual" : "Ingrese contraseña"}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rol:</label>
                  <select
                    name="rol_id"
                    value={formData.rol_id}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="1">Administrador</option>
                    <option value="2">Piloto</option>
                    <option value="3">Usuario</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Estado:</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>


              {/* Campo de selección de piloto - solo para rol piloto */}
              {formData.rol_id === '2' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Asignar a Piloto:</label>
                    {loadingPilotos ? (
                      <div className="loading-pilotos">
                        <div className="loading-spinner-small"></div>
                        <span>Cargando pilotos...</span>
                      </div>
                    ) : (
                      <select
                        name="piloto_id"
                        value={formData.piloto_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar piloto</option>
                        {pilotos.map(piloto => (
                          <option key={piloto.id} value={piloto.id}>
                            {piloto.nombre} {piloto.apellido} - {piloto.tipo_licencia}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              )}

              {/* Campo de asignación de permisos */}
              <div className="form-row">
                <div className="form-group permisos-group">
                  <label>Asignar Permisos:</label>
                  <div className="permisos-button-container">
                    <button 
                      type="button" 
                      className="btn-permissions"
                      onClick={handleOpenPermissionsModal}
                      style={{
                        backgroundColor: '#103053',
                        color: 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🔐 Seleccionar Permisos ({formData.permisos.length} seleccionados)
                    </button>
                    
                    {/* Mensaje informativo para rol Usuario */}
                    {formData.rol_id === '3' && (
                      <div className="user-role-info">
                        <div className="info-icon">ℹ️</div>
                        <div className="info-text">
                          <strong>Usuario:</strong> Debe seleccionar permisos manualmente. No tiene permisos predefinidos.
                        </div>
                      </div>
                    )}
                    
                    {formData.permisos.length > 0 && (
                      <div className="selected-permissions">
                        <strong>Permisos seleccionados:</strong>
                        <div className="permissions-list">
                          {formData.permisos.map(permisoId => {
                            const permiso = permisosDisponibles.find(p => p.id === permisoId);
                            return (
                              <span key={permisoId} className="permission-tag">
                                {permiso ? permiso.nombre.replace('_', ' ').toUpperCase() : `Permiso ${permisoId}`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {showEditForm ? 'Actualizar' : 'Crear'} Usuario
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  {showEditForm ? 'Cancelar' : 'Limpiar'}
                </button>
              </div>
            </form>
        </div>
      )}

      {/* Tabla de usuarios */}


      {/* Popup de mensajes */}
      {showPopup && (
        <PopUp
          isOpen={showPopup}
          message={popupMessage}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Modal de editar contraseña */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#1f2937',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}>
              🔑 Editar Contraseña
            </h3>
            
            <p style={{
              margin: '0 0 20px 0',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Usuario: <strong>{selectedUserForPassword?.username}</strong>
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                Nueva Contraseña:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelPassword}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePassword}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar contraseña */}
      {showViewPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#1f2937',
                fontSize: '1.5rem'
              }}>
                🔍 Contraseña del Usuario
              </h3>
              <button
                onClick={handleCloseViewPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '5px'
                }}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                margin: '0 0 10px 0',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <strong>Usuario:</strong> {selectedUserForViewPassword?.username}
              </p>
              <p style={{
                margin: '0 0 10px 0',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <strong>ID:</strong> {selectedUserForViewPassword?.id}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                Contraseña (Hash):
              </label>
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '15px',
                fontFamily: 'monospace',
                fontSize: '12px',
                wordBreak: 'break-all',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {selectedUserForViewPassword?.password || 'Sin contraseña'}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseViewPassword}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar lista de usuarios */}
      {showUsersModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '90%',
            maxHeight: '90%',
            width: '1200px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '15px'
            }}>
              <h2 style={{
                margin: 0,
                color: '#1f2937',
                fontSize: '1.5rem'
              }}>
                📋 Lista de Usuarios
              </h2>
              <button
                onClick={handleCloseUsers}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '5px'
                }}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflow: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              {loading ? (
                <div style={{
                  textAlign: 'center', 
                  padding: '40px', 
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  🔄 Cargando usuarios desde la base de datos...
                </div>
              ) : (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead style={{
                    backgroundColor: '#f8f9fa',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    <tr>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#495057'
                      }}>ID</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#495057'
                      }}>Usuario</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#495057'
                      }}>Contraseña</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#495057'
                      }}>Estado</th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '2px solid #dee2e6',
                        fontWeight: 'bold',
                        color: '#495057'
                      }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios && Array.isArray(usuarios) ? usuarios.map(usuario => (
                      <tr key={usuario.id} style={{
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <td style={{ padding: '12px' }}>{usuario.id}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{usuario.username}</td>
                        <td style={{ padding: '12px' }}>
                          <code style={{
                            fontSize: '12px',
                            background: '#f5f5f5',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                          }}>
                            {usuario.password ? usuario.password.substring(0, 20) + '...' : 'Sin contraseña'}
                          </code>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <select 
                            value={usuario.estado || 'activo'}
                            onChange={(e) => handleStatusChange(usuario.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              border: '1px solid #ccc',
                              backgroundColor: (usuario.estado || 'activo') === 'activo' ? '#d4edda' : '#f8d7da',
                              color: (usuario.estado || 'activo') === 'activo' ? '#155724' : '#721c24',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            <option value="activo" style={{backgroundColor: '#d4edda', color: '#155724'}}>Activo</option>
                            <option value="inactivo" style={{backgroundColor: '#f8d7da', color: '#721c24'}}>Desactivado</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button 
                              onClick={() => handleEditPassword(usuario)}
                              style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                              title="Editar contraseña"
                            >
                              🔑 Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(usuario.id)}
                              style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                              title="Eliminar usuario"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{
                          textAlign: 'center', 
                          padding: '40px',
                          color: '#6b7280',
                          fontSize: '16px'
                        }}>
                          {loading ? 'Cargando usuarios...' : 'No hay usuarios disponibles'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            <div style={{
              marginTop: '20px',
              paddingTop: '15px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseUsers}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de selección de permisos */}
      {showPermissionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '15px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#1f2937',
                fontSize: '1.5rem'
              }}>
                🔐 Seleccionar Permisos
              </h3>
              <button
                onClick={handleClosePermissionsModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '5px'
                }}
                title="Cerrar"
              >
                ✕
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflow: 'auto',
              marginBottom: '20px'
            }}>
              <div className="permisos-container">
                {permisosDisponibles.map(permiso => (
                  <div key={permiso.id} className="permiso-item">
                    <label className="permiso-checkbox">
                      <input
                        type="checkbox"
                        checked={tempPermissions.includes(permiso.id)}
                        onChange={(e) => handlePermissionChange(permiso.id, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <div className="permiso-info">
                        <span className="permiso-nombre">{permiso.nombre.replace('_', ' ').toUpperCase()}</span>
                        <span className="permiso-descripcion">{permiso.descripcion}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '15px'
            }}>
              <button
                onClick={handleClosePermissionsModal}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePermissions}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Guardar Permisos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación personalizado */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmAction}
        {...getConfirmDialogProps()}
      />
    </div>
  );
};

export default Usuarios;
