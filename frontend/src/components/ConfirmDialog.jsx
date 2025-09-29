import React from 'react';
import '../styles/success-modal.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-content">
          <div className="success-icon">
            ⚠️
          </div>
          <h3 className="success-title">{title}</h3>
          <p className="success-message">{message}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              className="success-close-btn" 
              onClick={onClose}
              style={{ 
                background: '#6c757d', 
                marginRight: '10px',
                padding: '10px 20px'
              }}
            >
              {cancelText}
            </button>
            <button 
              className="success-close-btn" 
              onClick={handleConfirm}
              style={{ 
                background: '#dc3545',
                padding: '10px 20px'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
