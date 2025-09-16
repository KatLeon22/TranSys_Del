import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Navbar />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}
