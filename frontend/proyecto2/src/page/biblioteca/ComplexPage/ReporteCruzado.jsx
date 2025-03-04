import React, { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import { BuscarPorParam } from "../../../services/general/useFetch";
import HelpChat from "../../../moduls/chatHub";
import "../../../css/biblioteca/ReporteCruzado.css";

export function ReporteCruzado() {
  const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7015/api/";
  const urlLibros = `${API_URL}Biblioteca/libros`;
  const urlAutores = `${API_URL}Biblioteca/autores`;

  const [reporteData, setReporteData] = useState({
    libros: [],
    autores: [],
    reporteCruzado: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener datos iniciales
  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [librosResult, autoresResult] = await Promise.all([
        BuscarPorParam(urlLibros, {}),
        BuscarPorParam(urlAutores, {})
      ]);

      if (!librosResult.success || !autoresResult.success) {
        throw new Error("Error al obtener datos");
      }

      // Crear matriz cruzada
      const cruzado = {};
      librosResult.data.forEach(libro => {
        if (!cruzado[libro.titulo]) {
          cruzado[libro.titulo] = {};
        }
        
        autoresResult.data.forEach(autor => {
          const autorNombre = `${autor.nombre} ${autor.apellido}`;
          cruzado[libro.titulo][autorNombre] = libro.autorCodigo === autor.codigo ? 1 : 0;
        });
      });

      setReporteData({
        libros: librosResult.data,
        autores: autoresResult.data,
        reporteCruzado: cruzado
      });
    } catch (error) {
      setError("Error al generar el reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

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
        <h2 className="title_reporte">Reporte Cruzado de Libros por Autor</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Generando reporte...</p>
        ) : Object.keys(reporteData.reporteCruzado).length > 0 ? (
          <div className="reporte_content">
            <table>
              <thead>
                <tr>
                  <th>Títulos / Autores</th>
                  {reporteData.autores.map(autor => (
                    <th key={autor.codigo}>
                      {`${autor.nombre} ${autor.apellido}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(reporteData.reporteCruzado).map(([titulo, autores], index) => (
                  <tr key={index}>
                    <td>{titulo}</td>
                    {reporteData.autores.map(autor => (
                      <td key={autor.codigo}>
                        {autores[`${autor.nombre} ${autor.apellido}`] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleImprimir} className="print-button">
              Imprimir Reporte
            </button>
          </div>
        ) : (
          <p>No hay datos disponibles para el reporte</p>
        )}
      </div>
      <HelpChat />
    </div>
  );
}

export default ReporteCruzado;