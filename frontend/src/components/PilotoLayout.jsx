import React, { useState, useEffect } from "react";
import PilotoSidebar from "./PilotoSidebar";
import PilotoNavbar from "./PilotoNavbar";
import MobileMenuToggle from "./MobileMenuToggle";
import "../styles/piloto-layout.css";

export default function PilotoLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [children]);

  // Cerrar menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.piloto-sidebar') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="piloto-layout">
      <PilotoSidebar isOpen={isMobileMenuOpen} />
      <div className="piloto-main">
        <PilotoNavbar onToggleMobileMenu={toggleMobileMenu} />
        <div className="piloto-content">{children}</div>
      </div>
      {/* Overlay para móviles */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay active"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}





