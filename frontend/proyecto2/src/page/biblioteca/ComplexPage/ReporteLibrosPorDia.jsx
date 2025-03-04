import React, { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import { BuscarPorParam } from "../../../services/general/useFetch";
import HelpChat from "../../../moduls/chatHub";
import "../../../css/biblioteca/ReporteLibrosPorDia.css";

export function ReporteLibrosPorDia() {
  const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7015/api/";
  const urlPrestamos = `${API_URL}Biblioteca/prestamos`;
  const urlLibros = `${API_URL}Biblioteca/libros`;
  const urlDetalles = `${API_URL}Biblioteca/detalleprestamos`;

  const [reporteData, setReporteData] = useState({
    fecha: "",
    detalles: [],
    libros: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener lista de libros para mostrar títulos
  const obtenerLibros = async () => {
    try {
      const result = await BuscarPorParam(urlLibros, {});
      if (result.success) {
        setReporteData(prev => ({
          ...prev,
          libros: result.data
        }));
      }
    } catch (error) {
      setError("Error al obtener la lista de libros");
    }
  };

  useEffect(() => {
    obtenerLibros();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Get all prestamos using the correct endpoint
      const prestamosResult = await BuscarPorParam(urlPrestamos, {});
      if (!prestamosResult.success) {
        throw new Error("Error al obtener préstamos");
      }
  
      // Get detalles using the correct endpoint with search parameters
      const detallesResult = await BuscarPorParam(`${urlDetalles}/buscar`, {
        fecha: reporteData.fecha
      });
  
      if (!detallesResult.success || !detallesResult.data) {
        console.log('Respuesta detalles:', detallesResult);
        throw new Error("Error al obtener detalles de préstamos");
      }
  
      // Process the details
      const librosPorEntregar = detallesResult.data.reduce((acc, detalle) => {
        // Verify the date matches
        const fechaEntrega = new Date(detalle.fechaEntrega).toISOString().split('T')[0];
        if (fechaEntrega === reporteData.fecha) {
          const existente = acc.find(item => item.codigoLibro === detalle.codigoLibro);
          if (existente) {
            existente.cantidad += parseInt(detalle.cantidad);
          } else {
            acc.push({
              codigoLibro: detalle.codigoLibro,
              cantidad: parseInt(detalle.cantidad),
              fechaEntrega: detalle.fechaEntrega
            });
          }
        }
        return acc;
      }, []);
  
      console.log('Libros procesados:', librosPorEntregar);
  
      setReporteData(prev => ({
        ...prev,
        detalles: librosPorEntregar
      }));
    } catch (error) {
      console.error('Error completo:', error);
      setError("Error al generar el reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleImprimir = () => {
    window.print();
  };
  return (
    <div className="container">
      <MenuHeader
        menuItems={[
          { title: "Atrás", link: "/biblioteca" },
          { title: "Home", link: "/home" }
        ]}
      />
      <div className="reporte_container">
        <h2 className="title_reporte">Reporte de Libros a Entregar por Día</h2>
  
        <form onSubmit={handleSubmit} className="form_reporte">
          <div className="form_item">
            <label>Fecha de Entrega:</label>
            <input
              type="date"
              value={reporteData.fecha}
              onChange={(e) => setReporteData(prev => ({ ...prev, fecha: e.target.value }))}
              required
            />
          </div>
          <button type="submit" disabled={loading}>Generar Reporte</button>
        </form>
  
        {error && <div className="error-message">{error}</div>}
  
        {loading ? (
          <p>Generando reporte...</p>
        ) : reporteData.detalles.length > 0 ? (
          <div className="reporte_content">
            <h3>Libros a entregar el {reporteData.fecha}</h3>
            <table>
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Cantidad Total</th>
                </tr>
              </thead>
              <tbody>
                {reporteData.detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>
                      {reporteData.libros.find(l => l.isbn === detalle.codigoLibro)?.titulo || 
                       detalle.codigoLibro}
                    </td>
                    <td>{detalle.cantidad}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>Total de Libros</strong></td>
                  <td>
                    <strong>
                      {reporteData.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={handleImprimir} className="print-button">
              Imprimir Reporte
            </button>
          </div>
        ) : reporteData.fecha && (
          <p>No hay libros para entregar en la fecha seleccionada</p>
        )}
      </div>
      <HelpChat />
    </div>
  );
}

export default ReporteLibrosPorDia;