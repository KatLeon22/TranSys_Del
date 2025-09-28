import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileMenuToggle from "./MobileMenuToggle";
import "../styles/layout.css";

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [children]);

  // Cerrar menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-toggle')) {
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
    <div className="layout">
      <Sidebar isOpen={isMobileMenuOpen} />
      <div className="layout-main">
        <Navbar onToggleMobileMenu={toggleMobileMenu} />
        <div className="layout-content">{children}</div>
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
