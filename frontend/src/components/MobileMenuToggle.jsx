import React from 'react';

const MobileMenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      className="mobile-menu-toggle"
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default MobileMenuToggle;

