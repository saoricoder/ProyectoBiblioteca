import React, { useState } from "react";
import { getLibros } from "../../../services/biblioteca.services/libro.service";
import { getAutores } from "../../../services/biblioteca.services/autor.service";
import { MenuHeader } from "../../../moduls/Menu_header";
import "../../../css/biblioteca/ReporteCruzado.css"; // Importar estilos
const ReporteCruzado = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporte, setReporte] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getLibros().then((librosResponse) => {
      getAutores().then((autoresResponse) => {
        const libros = librosResponse.data;
        const autores = autoresResponse.data;

        // Crear un mapa para contar libros por autor y título
        const reporteData = libros.map((libro) => {
          const autor = autores.find((a) => a.Codigo === libro.AutorCodigo);
          return {
            Titulo: libro.Titulo,
            Autor: autor ? `${autor.Nombre} ${autor.Apellido}` : "Desconocido",
          };
        });

        // Convertir a formato cruzado
        const cruzado = {};
        reporteData.forEach((item) => {
          if (!cruzado[item.Titulo]) {
            cruzado[item.Titulo] = {};
          }
          cruzado[item.Titulo][item.Autor] = (cruzado[item.Titulo][item.Autor] || 0) + 1;
        });

        setReporte(cruzado);
      });
    });
  };

  // Función para imprimir el reporte
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      <MenuHeader title1="Atras" link1="/biblioteca" title2="Home" link2="/home" />
      <h1>Reporte Cruzado</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        <button type="submit">Generar Reporte</button>
      </form>

      {/* Tabla de resultados */}
      {Object.keys(reporte).length > 0 && (
        <div>
          <h2>Reporte Cruzado</h2>
          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Título del Libro</th>
                {Object.keys(reporte[Object.keys(reporte)[0]]).map((autor, index) => (
                  <th key={index}>{autor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(reporte).map((titulo, index) => (
                <tr key={index}>
                  <td>{titulo}</td>
                  {Object.keys(reporte[titulo]).map((autor, idx) => (
                    <td key={idx}>{reporte[titulo][autor]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleImprimir} style={{ marginTop: "10px" }}>
            Imprimir Reporte
          </button>
        </div>
      )}
    </div>
  );
};

export default ReporteCruzado;