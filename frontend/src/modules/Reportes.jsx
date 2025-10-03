// src/modules/Reportes.jsx
import React, { useState, useEffect } from "react";
import reportesService from "../services/reportesService.js";
import LimitedAccessMenu from "../components/LimitedAccessMenu.jsx";
import "../styles/reportes.css";
import Logo from "../assets/logo.png";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("dia"); // dia, mes, año
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [filtroDias, setFiltroDias] = useState(7); // Filtro de días para mostrar
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10); // Elementos por página

  useEffect(() => {
    cargarReportes();
  }, [filtro, fechaInicio, fechaFin]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroDias, elementosPorPagina]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('=== INICIANDO CARGA DE REPORTES ===');
      console.log('Parámetros:', { filtro, fechaInicio, fechaFin });
      
      const response = await reportesService.getReportes(filtro, fechaInicio, fechaFin);
      console.log('=== RESPUESTA DEL SERVICIO ===');
      console.log('Response completa:', response);
      console.log('Response.success:', response?.success);
      console.log('Response.data:', response?.data);
      console.log('Response.count:', response?.count);
      
      if (response && response.success) {
        console.log('✅ Reportes cargados exitosamente:', response.data);
        console.log('📊 Contenido del primer reporte:', response.data[0]);
        console.log('📈 Total de reportes:', response.data.length);
        
        // Debug detallado de los datos
        if (response.data && response.data.length > 0) {
          const primerReporte = response.data[0];
          console.log('🔍 Análisis detallado del primer reporte:');
          console.log('- Total rutas:', primerReporte.total_rutas);
          console.log('- Rutas pendientes:', primerReporte.rutas_pendientes);
          console.log('- Rutas en curso:', primerReporte.rutas_en_curso);
          console.log('- Rutas entregadas:', primerReporte.rutas_entregadas);
          console.log('- Rutas incidentes:', primerReporte.rutas_incidentes);
          console.log('- Ingresos totales:', primerReporte.ingresos_totales);
        }
        
        setReportes(response.data || []);
        setError(""); // Limpiar errores anteriores
      } else {
        console.log('❌ Error en la respuesta:', response);
        setError(response?.message || "Error al cargar los reportes");
      }
    } catch (error) {
      console.error("❌ Error cargando reportes:", error);
      console.error("Error completo:", error.message);
      setError("Error al cargar los reportes: " + error.message);
    } finally {
      setLoading(false);
      console.log('=== FINALIZANDO CARGA DE REPORTES ===');
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    // Limpiar fechas al cambiar filtro
    setFechaInicio("");
    setFechaFin("");
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  const handleFiltroDiasChange = (e) => {
    setFiltroDias(parseInt(e.target.value));
  };

  const handleElementosPorPaginaChange = (e) => {
    setElementosPorPagina(parseInt(e.target.value));
    setPaginaActual(1); // Reset a la primera página
  };

  // Función para filtrar datos por número de días
  const filtrarDatosPorDias = (datos, dias) => {
    if (!datos || datos.length === 0) return datos;
    
    // Si es "todos los datos", devolver todo
    if (dias === 999) return datos;
    
    // Devolver solo los primeros N días
    return datos.slice(0, dias);
  };

  // Función para obtener datos paginados
  const obtenerDatosPaginados = (datos) => {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return datos.slice(inicio, fin);
  };

  // Función para calcular el total de páginas
  const calcularTotalPaginas = (datos) => {
    return Math.ceil(datos.length / elementosPorPagina);
  };

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  // Función para ir a la página anterior
  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  // Función para ir a la página siguiente
  const paginaSiguiente = () => {
    const datosFiltrados = filtrarDatosPorDias(reportes, filtroDias);
    const totalPaginas = calcularTotalPaginas(datosFiltrados);
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };


  const exportarReporte = () => {
    // Mostrar reporte visual primero
    setMostrarReporte(true);
  };

  const imprimirPDF = async () => {
    // Generar PDF
    await generarPDF();
  };

  const generarPDF = async () => {
    try {
      console.log('📄 Generando PDF profesional...');
      console.log('📊 Datos para PDF:', reportes);
      
      // Crear nuevo documento PDF con orientación portrait (vertical)
      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Configuración de colores corporativos
      const colorPrimario = [44, 62, 80]; // Azul oscuro S DE LEON
      const colorSecundario = [52, 152, 219]; // Azul claro
      const colorVerde = [39, 174, 96];
      const colorNaranja = [243, 156, 18];
      const colorRojo = [231, 76, 60];
      const colorGris = [127, 140, 141];
      const colorFondo = [248, 249, 250];
      
      let yPosition = 20;
      
      // === ENCABEZADO CORPORATIVO ===
      // Fondo del encabezado
      doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.rect(0, 0, 210, 35, 'F');
      
      // Logo y título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('S DE LEON', 105, 15, { align: 'center' });
      
      // Subtítulo del sistema
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Administración de Transporte', 105, 25, { align: 'center' });
      
      // Fecha del reporte
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.setFontSize(10);
      doc.text(`Reporte generado el: ${fechaFormateada}`, 105, 32, { align: 'center' });
      
      // Agregar logotipo de la empresa
      try {
        // Crear un elemento de imagen temporal para cargar el logo
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // Esperar a que la imagen se cargue
        await new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              // Crear canvas para convertir la imagen
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              // Convertir a base64
              const logoDataURL = canvas.toDataURL('image/png');
              
              // Agregar logo al PDF (posicionado a la izquierda del título, más ancho)
              doc.addImage(logoDataURL, 'PNG', 10, 5, 35, 20);
              
              console.log('✅ Logo agregado al PDF exitosamente');
              resolve();
            } catch (error) {
              console.log('❌ Error procesando logo:', error);
              reject(error);
            }
          };
          
          img.onerror = () => {
            console.log('❌ Error cargando logo');
            reject(new Error('No se pudo cargar el logo'));
          };
          
          // Cargar la imagen
          img.src = Logo;
        });
        
      } catch (error) {
        console.log('❌ No se pudo cargar el logo:', error);
        // Si no se puede cargar el logo, continuar sin él
      }
      
      // Subtítulo ya incluido en el encabezado, eliminado para evitar duplicación
      
      yPosition = 50;
      
      // === INFORMACIÓN DEL REPORTE ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`REPORTE DE RUTAS - ${filtro.toUpperCase()}`, 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (fechaInicio && fechaFin) {
        doc.text(`Período: ${fechaInicio} a ${fechaFin}`, 20, yPosition);
        yPosition += 6;
      }
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 20, yPosition);
      
      yPosition += 20;
      
      // === ESTADÍSTICAS GENERALES ===
      const stats = calcularEstadisticas();
      
      // Título de sección
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMEN EJECUTIVO', 20, yPosition);
      yPosition += 15;
      
      // Tarjetas de estadísticas con diseño profesional (más compactas)
      const cardWidth = 35;
      const cardHeight = 22;
      const cardSpacing = 8;
      const startX = 20;
      
      // Total de Rutas
      doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
      doc.rect(startX, yPosition, cardWidth, cardHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(stats.totalRutas.toString(), startX + cardWidth/2, yPosition + 9, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('TOTAL RUTAS', startX + cardWidth/2, yPosition + 16, { align: 'center' });
      
      // Rutas Pendientes
      doc.setFillColor(colorNaranja[0], colorNaranja[1], colorNaranja[2]);
      doc.rect(startX + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(stats.rutasPendientes.toString(), startX + cardWidth + cardSpacing + cardWidth/2, yPosition + 9, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('PENDIENTES', startX + cardWidth + cardSpacing + cardWidth/2, yPosition + 16, { align: 'center' });
      
      // Rutas En Curso
      doc.setFillColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
      doc.rect(startX + (cardWidth + cardSpacing) * 2, yPosition, cardWidth, cardHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(stats.rutasEnCurso.toString(), startX + (cardWidth + cardSpacing) * 2 + cardWidth/2, yPosition + 9, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('EN CURSO', startX + (cardWidth + cardSpacing) * 2 + cardWidth/2, yPosition + 16, { align: 'center' });
      
      // Ingresos Totales
      doc.setFillColor(colorRojo[0], colorRojo[1], colorRojo[2]);
      doc.rect(startX + (cardWidth + cardSpacing) * 3, yPosition, cardWidth, cardHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${stats.ingresosTotales.toFixed(2)}`, startX + (cardWidth + cardSpacing) * 3 + cardWidth/2, yPosition + 9, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('INGRESOS TOTALES', startX + (cardWidth + cardSpacing) * 3 + cardWidth/2, yPosition + 16, { align: 'center' });
      
      yPosition += 35;
      
      // === GRÁFICO DE BARRAS SIMPLE ===
      if (reportes.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('DISTRIBUCIÓN DE RUTAS POR ESTADO', 20, yPosition);
        yPosition += 15;
        
        // Crear gráfico de barras con ejes X e Y
        const maxValue = Math.max(stats.rutasPendientes, stats.rutasEnCurso, stats.rutasEntregadas, stats.rutasIncidentes, 1);
        const chartWidth = 150;
        const chartHeight = 80;
        const barWidth = 25;
        const barSpacing = 35;
        const startX = 30;
        const startY = yPosition;
        
        // Dibujar ejes X e Y
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        
        // Eje Y (vertical)
        doc.line(startX, startY, startX, startY + chartHeight);
        
        // Eje X (horizontal)
        doc.line(startX, startY + chartHeight, startX + chartWidth, startY + chartHeight);
        
        // Líneas de cuadrícula horizontales
        const gridLines = 5;
        for (let i = 1; i <= gridLines; i++) {
          const gridY = startY + (chartHeight / gridLines) * i;
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(startX, gridY, startX + chartWidth, gridY);
          
          // Etiquetas del eje Y
          doc.setDrawColor(0, 0, 0);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          const value = Math.round((maxValue / gridLines) * (gridLines - i));
          doc.text(value.toString(), startX - 15, gridY + 2, { align: 'right' });
        }
        
        // Líneas de cuadrícula verticales
        for (let i = 1; i <= 4; i++) {
          const gridX = startX + (chartWidth / 4) * i;
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(gridX, startY, gridX, startY + chartHeight);
        }
        
        // Barra Pendientes
        const pendientesHeight = (stats.rutasPendientes / maxValue) * chartHeight;
        const pendientesX = startX + 10;
        doc.setFillColor(colorNaranja[0], colorNaranja[1], colorNaranja[2]);
        doc.rect(pendientesX, startY + chartHeight - pendientesHeight, barWidth, pendientesHeight, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text('Pendientes', pendientesX + barWidth/2, startY + chartHeight + 8, { align: 'center' });
        doc.text(stats.rutasPendientes.toString(), pendientesX + barWidth/2, startY + chartHeight - pendientesHeight/2, { align: 'center' });
        
        // Barra En Curso
        const enCursoHeight = (stats.rutasEnCurso / maxValue) * chartHeight;
        const enCursoX = pendientesX + barSpacing;
        doc.setFillColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.rect(enCursoX, startY + chartHeight - enCursoHeight, barWidth, enCursoHeight, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text('En Curso', enCursoX + barWidth/2, startY + chartHeight + 8, { align: 'center' });
        doc.text(stats.rutasEnCurso.toString(), enCursoX + barWidth/2, startY + chartHeight - enCursoHeight/2, { align: 'center' });
        
        // Barra Entregadas
        const entregadasHeight = (stats.rutasEntregadas / maxValue) * chartHeight;
        const entregadasX = enCursoX + barSpacing;
        doc.setFillColor(colorVerde[0], colorVerde[1], colorVerde[2]);
        doc.rect(entregadasX, startY + chartHeight - entregadasHeight, barWidth, entregadasHeight, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text('Entregadas', entregadasX + barWidth/2, startY + chartHeight + 8, { align: 'center' });
        doc.text(stats.rutasEntregadas.toString(), entregadasX + barWidth/2, startY + chartHeight - entregadasHeight/2, { align: 'center' });
        
        // Barra Incidentes
        const incidentesHeight = (stats.rutasIncidentes / maxValue) * chartHeight;
        const incidentesX = entregadasX + barSpacing;
        doc.setFillColor(colorRojo[0], colorRojo[1], colorRojo[2]);
        doc.rect(incidentesX, startY + chartHeight - incidentesHeight, barWidth, incidentesHeight, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text('Incidentes', incidentesX + barWidth/2, startY + chartHeight + 8, { align: 'center' });
        doc.text(stats.rutasIncidentes.toString(), incidentesX + barWidth/2, startY + chartHeight - incidentesHeight/2, { align: 'center' });
        
        // Título del eje Y
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Cantidad de Rutas', 5, startY + chartHeight/2, { align: 'center', angle: 90 });
        
        yPosition += 80;
      }
      
      // === TABLA DETALLADA ===
      if (reportes.length > 0) {
        // Agregar espacio adicional antes del título de la tabla
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('DETALLE POR PERÍODO', 20, yPosition);
        yPosition += 10;
        
        // Preparar datos para la tabla
        const tableData = reportes.map(reporte => [
          reporte.periodo || 'N/A',
          reporte.total_rutas || 0,
          reporte.rutas_pendientes || 0,
          reporte.rutas_en_curso || 0,
          reporte.rutas_entregadas || 0,
          reporte.rutas_incidentes || 0,
          `Q${(reporte.ingresos_totales || 0).toFixed(2)}`
        ]);
        
        // Usar autoTable para una tabla profesional
        autoTable(doc, {
          startY: yPosition,
          head: [['Período', 'Total Rutas', 'Pendientes', 'En Curso', 'Entregadas', 'Incidentes', 'Ingresos (Q)']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [colorPrimario[0], colorPrimario[1], colorPrimario[2]],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [0, 0, 0]
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250]
          },
          margin: { left: 15, right: 15 },
          styles: {
            cellPadding: 3,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          columnStyles: {
            0: { cellWidth: 25 }, // Período
            1: { cellWidth: 18, halign: 'center' }, // Total
            2: { cellWidth: 18, halign: 'center' }, // Pendientes
            3: { cellWidth: 18, halign: 'center' }, // En Curso
            4: { cellWidth: 18, halign: 'center' }, // Entregadas
            5: { cellWidth: 18, halign: 'center' }, // Incidentes
            6: { cellWidth: 22, halign: 'right' } // Ingresos
          }
        });
      }
      
      // === PIE DE PÁGINA ===
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Reporte generado automáticamente por el Sistema de Administración de Transporte', 105, pageHeight - 15, { align: 'center' });
      doc.text('© 2025 S DE LEON - Todos los derechos reservados', 105, pageHeight - 10, { align: 'center' });
      
      // === GUARDAR PDF ===
      const fileName = `reporte_rutas_${filtro}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      console.log('✅ PDF profesional generado exitosamente:', fileName);
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  const cerrarReporte = () => {
    setMostrarReporte(false);
  };

  // Calcular estadísticas para el reporte
  const calcularEstadisticas = () => {
    const totalRutas = reportes.reduce((sum, r) => sum + (r.total_rutas || 0), 0);
    const rutasPendientes = reportes.reduce((sum, r) => sum + (r.rutas_pendientes || 0), 0);
    const rutasEnCurso = reportes.reduce((sum, r) => sum + (r.rutas_en_curso || 0), 0);
    const rutasEntregadas = reportes.reduce((sum, r) => sum + (r.rutas_entregadas || 0), 0);
    const rutasIncidentes = reportes.reduce((sum, r) => sum + (r.rutas_incidentes || 0), 0);
    const ingresosTotales = reportes.reduce((sum, r) => sum + (r.ingresos_totales || 0), 0);
    
    const porcentajePendientes = totalRutas > 0 ? (rutasPendientes / totalRutas * 100).toFixed(1) : 0;
    const porcentajeEnCurso = totalRutas > 0 ? (rutasEnCurso / totalRutas * 100).toFixed(1) : 0;
    const porcentajeEntregadas = totalRutas > 0 ? (rutasEntregadas / totalRutas * 100).toFixed(1) : 0;
    const porcentajeIncidentes = totalRutas > 0 ? (rutasIncidentes / totalRutas * 100).toFixed(1) : 0;

    console.log('📊 Estadísticas calculadas:', {
      totalRutas,
      rutasPendientes,
      rutasEnCurso,
      rutasEntregadas,
      rutasIncidentes,
      porcentajePendientes,
      porcentajeEnCurso,
      porcentajeEntregadas,
      porcentajeIncidentes
    });

    return {
      totalRutas,
      rutasPendientes,
      rutasEnCurso,
      rutasEntregadas,
      rutasIncidentes,
      ingresosTotales,
      porcentajePendientes,
      porcentajeEnCurso,
      porcentajeEntregadas,
      porcentajeIncidentes
    };
  };

  // Log del estado actual
  console.log('🔍 Estado actual del componente:', {
    loading,
    error,
    reportes: reportes.length,
    filtro,
    fechaInicio,
    fechaFin
  });

  if (loading) {
    return (
      <div className="reportes-container">
        <h2>Reportes de Rutas</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reportes-container">
      <div className="logo-container">
        <img src={Logo} alt="Logo Empresa" className="logo" />
      </div>

      <LimitedAccessMenu />
      
      <h2 className="reportes-title">Reportes de Rutas</h2>

      {error && (
        <div className="error-message" style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label htmlFor="filtro">Tipo de Reporte:</label>
          <select
            id="filtro"
            value={filtro}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="dia">Por Día</option>
            <option value="mes">Por Mes</option>
            <option value="año">Por Año</option>
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="fechaInicio">Fecha Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            className="filtro-input"
          />
        </div>

        <div className="filtro-group">
          <label htmlFor="fechaFin">Fecha Fin:</label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={handleFechaFinChange}
            className="filtro-input"
          />
        </div>


        <div className="filtro-actions">
              <button onClick={exportarReporte} className="btn-exportar">
                👁️ Ver Reporte
              </button>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="reportes-table-container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando reportes...</p>
          </div>
        )}
        
        {!loading && (
          <>
            {/* Controles de filtros y paginación arriba de la tabla */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3>Reporte Histórico</h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Selector de elementos por página */}
                {reportes.length > 0 && (
                  <div className="paginacion-elementos">
                    <label htmlFor="elementosPorPagina">Páginas:</label>
                    <select
                      id="elementosPorPagina"
                      value={elementosPorPagina}
                      onChange={handleElementosPorPaginaChange}
                      className="paginacion-select"
                    >
                      <option value={5}>5 por página</option>
                      <option value={10}>10 por página</option>
                      <option value={20}>20 por página</option>
                      <option value={50}>50 por página</option>
                      <option value={100}>100 por página</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <table className="reportes-table">
                  <thead>
                    <tr>
                      <th>Período</th>
                      <th>Total de Rutas</th>
                      <th>Pendientes</th>
                      <th>En Curso</th>
                      <th>Entregadas</th>
                      <th>Incidentes</th>
                      <th>Ingresos Totales (Q)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obtenerDatosPaginados(reportes).map((reporte, index) => (
                      <tr key={index}>
                        <td>{reporte.periodo}</td>
                        <td>{reporte.total_rutas}</td>
                        <td>{reporte.rutas_pendientes}</td>
                        <td>{reporte.rutas_en_curso}</td>
                        <td>{reporte.rutas_entregadas}</td>
                        <td>{reporte.rutas_incidentes}</td>
                        <td>Q {reporte.ingresos_totales?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
            </table>

            {reportes.length === 0 && !loading && (
              <div className="no-data">
                <p>No hay datos para mostrar con los filtros seleccionados</p>
              </div>
            )}

            {/* Navegación de páginas abajo de la tabla */}
            {reportes.length > 0 && (() => {
              const totalPaginas = calcularTotalPaginas(reportes);
              const inicio = (paginaActual - 1) * elementosPorPagina + 1;
              const fin = Math.min(paginaActual * elementosPorPagina, reportes.length);
              
              if (totalPaginas > 1) {
                return (
                  <div className="paginacion-container">
                    <div className="paginacion-info">
                      <span>
                        Mostrando {inicio}-{fin} de {reportes.length} registros
                      </span>
                    </div>
                    
                    <div className="paginacion-controls">
                      <button 
                        onClick={paginaAnterior}
                        disabled={paginaActual === 1}
                        className="paginacion-btn"
                        title="Página anterior"
                      >
                        ◀️ Anterior
                      </button>
                      
                      <div className="paginacion-numeros">
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                          <button
                            key={numero}
                            onClick={() => cambiarPagina(numero)}
                            className={`paginacion-numero ${paginaActual === numero ? 'activa' : ''}`}
                          >
                            {numero}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        onClick={paginaSiguiente}
                        disabled={paginaActual === totalPaginas}
                        className="paginacion-btn"
                        title="Página siguiente"
                      >
                        Siguiente ▶️
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

          </>
        )}
      </div>


      {/* Reporte Visual */}
      {mostrarReporte && (
        <div className="reporte-visual-overlay">
          <div className="reporte-visual-container">
            <div className="reporte-visual-header">
              <div className="reporte-visual-titulo">S DE LEON</div>
              <div className="reporte-visual-subtitulo">Sistema de Administración de Transporte</div>
              <div className="reporte-visual-fecha">
                Reporte generado el: {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <button className="cerrar-reporte-btn" onClick={cerrarReporte}>✕ Cerrar</button>
            </div>

            <div className="reporte-visual-estadisticas">
              {(() => {
                const stats = calcularEstadisticas();
                return (
                  <>
                    <div className="reporte-stat-card azul">
                      <div className="reporte-stat-numero">{stats.totalRutas}</div>
                      <div className="reporte-stat-label">Total de Rutas</div>
                    </div>
                        <div className="reporte-stat-card verde">
                          <div className="reporte-stat-numero">{stats.rutasEntregadas}</div>
                          <div className="reporte-stat-label">Rutas Entregadas</div>
                        </div>
                    <div className="reporte-stat-card naranja">
                      <div className="reporte-stat-numero">{stats.rutasPendientes}</div>
                      <div className="reporte-stat-label">Rutas Pendientes</div>
                    </div>
                    <div className="reporte-stat-card rojo">
                      <div className="reporte-stat-numero">Q {stats.ingresosTotales.toFixed(2)}</div>
                      <div className="reporte-stat-label">Ingresos Totales</div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="reporte-visual-graficos">
              <div className="reporte-grafico-titulo">Distribución de Rutas por Estado</div>
              {(() => {
                const stats = calcularEstadisticas();
                return (
                  <>
                        <div className="reporte-barra-container">
                          <div className="reporte-barra-label">
                            <span>Rutas Pendientes</span>
                            <span>{stats.rutasPendientes} ({stats.porcentajePendientes}%)</span>
                          </div>
                          <div className="reporte-barra">
                            <div 
                              className="reporte-barra-fill pendientes" 
                              style={{width: `${Math.max(stats.porcentajePendientes, 2)}%`}}
                            >
                              {stats.porcentajePendientes}%
                            </div>
                          </div>
                        </div>

                        <div className="reporte-barra-container">
                          <div className="reporte-barra-label">
                            <span>Rutas En Curso</span>
                            <span>{stats.rutasEnCurso} ({stats.porcentajeEnCurso}%)</span>
                          </div>
                          <div className="reporte-barra">
                            <div 
                              className="reporte-barra-fill en-curso" 
                              style={{width: `${Math.max(stats.porcentajeEnCurso, 2)}%`}}
                            >
                              {stats.porcentajeEnCurso}%
                            </div>
                          </div>
                        </div>

                        <div className="reporte-barra-container">
                          <div className="reporte-barra-label">
                            <span>Rutas Entregadas</span>
                            <span>{stats.rutasEntregadas} ({stats.porcentajeEntregadas}%)</span>
                          </div>
                          <div className="reporte-barra">
                            <div 
                              className="reporte-barra-fill entregadas" 
                              style={{width: `${Math.max(stats.porcentajeEntregadas, 2)}%`}}
                            >
                              {stats.porcentajeEntregadas}%
                            </div>
                          </div>
                        </div>

                        <div className="reporte-barra-container">
                          <div className="reporte-barra-label">
                            <span>Rutas con Incidentes</span>
                            <span>{stats.rutasIncidentes} ({stats.porcentajeIncidentes}%)</span>
                          </div>
                          <div className="reporte-barra">
                            <div 
                              className="reporte-barra-fill incidentes" 
                              style={{width: `${Math.max(stats.porcentajeIncidentes, 2)}%`}}
                            >
                              {stats.porcentajeIncidentes}%
                            </div>
                          </div>
                        </div>
                  </>
                );
              })()}
            </div>

            <div className="reporte-visual-tabla">
              <table>
                    <thead>
                      <tr>
                        <th>Período</th>
                        <th>Total Rutas</th>
                        <th>Pendientes</th>
                        <th>En Curso</th>
                        <th>Entregadas</th>
                        <th>Incidentes</th>
                        <th>Ingresos (Q)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrarDatosPorDias(reportes, filtroDias).map((reporte, index) => (
                        <tr key={index}>
                          <td>{reporte.periodo}</td>
                          <td>{reporte.total_rutas}</td>
                          <td>{reporte.rutas_pendientes}</td>
                          <td>{reporte.rutas_en_curso}</td>
                          <td>{reporte.rutas_entregadas}</td>
                          <td>{reporte.rutas_incidentes}</td>
                          <td>Q {reporte.ingresos_totales?.toFixed(2) || '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
              </table>
            </div>

                <div className="reporte-visual-footer">
                  <div className="reporte-footer-actions">
                    <button onClick={imprimirPDF} className="btn-imprimir-pdf">
                      📄 Imprimir PDF
                    </button>
                    <button onClick={cerrarReporte} className="btn-cerrar-reporte">
                      ✕ Cerrar
                    </button>
                  </div>
                  <p>Reporte generado automáticamente por el Sistema de Administración de Transporte</p>
                  <p>© 2025 S DE LEON - Todos los derechos reservados</p>
                </div>
          </div>
        </div>
      )}
    </div>
  );
}