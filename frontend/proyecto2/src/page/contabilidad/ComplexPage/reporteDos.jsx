import { MenuHeader } from "../../../moduls/Menu_header";
import React, { useEffect, useState } from "react";
import "../../../css/contabilidad/resultados.css";
import HelpChat from "../../../moduls/chatHub";

export function ReporteDos() {
  const [resultados, setResultados] = useState({
    ingresos: [],
    egresos: [],
    utilidad: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamada a la API con fetch
    fetch("http://localhost:5286/api/Contabilidad/resultados")
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los datos");
        return response.json();
      })
      .then((data) => {
        setResultados(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando balance general...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Calcular totales
  const totalIngresos = resultados.ingresos.reduce(
    (sum, item) => sum + item.saldo,
    0
  );
  const totalEgresos = resultados.egresos.reduce(
    (sum, item) => sum + item.saldo,
    0
  );
  const totalUtilidades = resultados.utilidad.reduce(
    (sum, item) => sum + item.saldo,
    0
  );

  const TotalUtilidad = totalIngresos + totalUtilidades - totalEgresos;

  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/contabilidad"
        title2="Home"
        link2="/"
      />
      {/* Tabla de resultados */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {/* Ingresos */}
            <tr>
              <td colSpan="2">
                <strong>Ingresos</strong>
              </td>
            </tr>
            {resultados.ingresos.map((item) => (
              <tr key={item.codigo}>
                <td>{item.nombre}</td>
                <td>${item.saldo.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total Ingresos</strong>
              </td>
              <td>
                <strong>${totalIngresos.toFixed(2)}</strong>
              </td>
            </tr>

            {/* Egresos */}
            <tr>
              <td colSpan="2">
                <strong>Egresos</strong>
              </td>
            </tr>
            {resultados.egresos.map((item) => (
              <tr key={item.codigo}>
                <td>{item.nombre}</td>
                <td>${item.saldo.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total Egresos</strong>
              </td>
              <td>
                <strong>${totalEgresos.toFixed(2)}</strong>
              </td>
            </tr>

            {/* Utilidad */}
            <tr>
              <td colSpan="2">
                <strong>Utilidad</strong>
              </td>
            </tr>
            {resultados.utilidad.map((item) => (
              <tr key={item.codigo}>
                <td>{item.nombre}</td>
                <td>${item.saldo.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total Utilidad</strong>
              </td>
              <td>
                <strong>${totalUtilidades.toFixed(2)}</strong>
              </td>
            </tr>

            {/* Total Utilidad */}
            <tr>
              <td>
                <strong>Utilidades</strong>
              </td>
              <td>
                <strong>${TotalUtilidad.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <HelpChat />
    </div>
  );
}
