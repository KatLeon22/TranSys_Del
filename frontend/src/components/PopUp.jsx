import React from 'react';
import '../styles/success-modal.css';

const PopUp = ({ isOpen, onClose, message, type = 'success' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'edit':
        return '✏️';
      case 'delete':
        return '🗑️';
      default:
        return '✅';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Datos ingresados con éxito';
      case 'edit':
        return 'Editado con éxito';
      case 'delete':
        return 'Eliminado con éxito';
      default:
        return 'Operación exitosa';
    }
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-content">
          <div className="success-icon">
            {getIcon()}
          </div>
          <h3 className="success-title">{getTitle()}</h3>
          <p className="success-message">{message}</p>
          <button 
            className="success-close-btn" 
            onClick={onClose}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
