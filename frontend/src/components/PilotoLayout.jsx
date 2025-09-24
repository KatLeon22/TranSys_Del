import React from "react";
import PilotoSidebar from "./PilotoSidebar";
import PilotoNavbar from "./PilotoNavbar";
import "../styles/piloto-layout.css";

export default function PilotoLayout({ children }) {
  return (
    <div className="piloto-layout">
      <PilotoSidebar />
      <div className="piloto-main">
        <PilotoNavbar />
        <div className="piloto-content">{children}</div>
      </div>
    </div>
  );
}




