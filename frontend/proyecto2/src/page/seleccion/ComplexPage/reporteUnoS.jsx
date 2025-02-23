import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import HelpChat from "../../../moduls/chatHub";

export function ReporteUnos() {
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    const datosGuardados =
      JSON.parse(localStorage.getItem("evaluaciones")) || [];
    setEvaluaciones(datosGuardados);
  }, []);

  const ranking = evaluaciones
    .reduce((acc, ev) => {
      let index = acc.findIndex((c) => c.candidato === ev.candidato);
      if (index !== -1) acc[index].total += Number(ev.calificacion);
      else
        acc.push({ candidato: ev.candidato, total: Number(ev.calificacion) });
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total);

  const imprimirReporte = () => {
    window.print();
  };

  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/seleccion" title2="Home" link2="/" />
      <h1 className="title">Ranking de Evaluados</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre Evaluado</th>
            <th>Puntaje Total</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((r, i) => (
            <tr key={i}>
              <td>{r.candidato}</td>
              <td>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={imprimirReporte}>Imprimir Reporte</button>
      <HelpChat />
    </div>
  );
}
