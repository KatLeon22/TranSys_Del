import React from 'react';

const MobileMenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      className="mobile-menu-toggle"
      onClick={onToggle}
      aria-label="Toggle menu"
      style={{
        display: 'none',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        color: 'white',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease'
      }}
    >
      {isOpen ? '✕' : '☰'}
    </button>
  );
};

export default MobileMenuToggle;

