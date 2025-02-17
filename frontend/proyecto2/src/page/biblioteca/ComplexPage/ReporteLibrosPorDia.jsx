import React, { useState } from "react";
import { getPrestamos } from "../../../services/biblioteca.services/prestamo.service";
import { MenuHeader } from "../../../moduls/Menu_header";
import "../../../css/biblioteca/ReporteLibrosPorDia.css"; // Importar estilos
const ReporteLibrosPorDia = () => {
  const [fecha, setFecha] = useState("");
  const [libros, setLibros] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getPrestamos().then((response) => {
      const prestamosDelDia = response.data.filter((p) => p.FechaPrestamo === fecha);
      const librosDelDia = prestamosDelDia.flatMap((p) => p.Detalles);
      setLibros(librosDelDia);
    });
  };

  // Función para imprimir la tabla
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      <MenuHeader title1="Atras" link1="/biblioteca" title2="Home" link2="/home" />
      <h1>Reporte de Libros por Día</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <button type="submit">Generar Reporte</button>
      </form>

      {/* Tabla de resultados */}
      {libros.length > 0 && (
        <div>
          <h2>Libros prestados el {fecha}</h2>
          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Código de Libro (ISBN)</th>
                <th>Cantidad</th>
                <th>Fecha de Entrega</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro, index) => (
                <tr key={index}>
                  <td>{libro.CodigoLibro}</td>
                  <td>{libro.Cantidad}</td>
                  <td>{libro.FechaEntrega}</td>
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

export default ReporteLibrosPorDia;