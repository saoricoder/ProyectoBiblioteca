import { MenuHeader } from "../../../moduls/Menu_header";
import { useEffect, useState } from "react";
import HelpChat from "../../../moduls/chatHub";

export function ReporteUno() {
  const [balance, setBalance] = useState({
    activos: [],
    pasivos: [],
    capital: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5286/api/contabilidad/balance")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los datos");
        return res.json();
      })
      .then((data) => {
        setBalance(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando balance general...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Calcular totales
  const totalActivos = balance.activos.reduce(
    (sum, item) => sum + item.saldo,
    0
  );
  const totalPasivos = balance.pasivos.reduce(
    (sum, item) => sum + item.saldo,
    0
  );
  const totalCapital = balance.capital.reduce(
    (sum, item) => sum + item.saldo,
    0
  );
  const totalPasivosCapital = totalPasivos + totalCapital;

  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/contabilidad"
        title2="Home"
        link2="/"
      />
      <div className="reporte_container">
        <div className="container">
          <h2 className="title_balance">Balance General</h2>

          <table>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2">
                  <strong>Activos</strong>
                </td>
              </tr>
              {balance.activos.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.nombre}</td>
                  <td>${item.saldo.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <strong>Total Activos</strong>
                </td>
                <td>
                  <strong>${totalActivos.toFixed(2)}</strong>
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <strong>Pasivos</strong>
                </td>
              </tr>
              {balance.pasivos.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.nombre}</td>
                  <td>${item.saldo.toFixed(2)}</td>
                </tr>
              ))}

              <tr>
                <td colSpan="2">
                  <strong>Capital</strong>
                </td>
              </tr>
              {balance.capital.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.nombre}</td>
                  <td>${item.saldo.toFixed(2)}</td>
                </tr>
              ))}

              <tr>
                <td>
                  <strong>Total Pasivos + Capital</strong>
                </td>
                <td>
                  <strong>${totalPasivosCapital.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Mostrar mensaje si el balance no cuadra */}
          {totalActivos !== totalPasivosCapital && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ¡El Balance General no cuadra!
            </p>
          )}
        </div>
      </div>
      <HelpChat />
    </div>
  );
}
