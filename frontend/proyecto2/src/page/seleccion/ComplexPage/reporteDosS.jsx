import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import HelpChat from "../../../moduls/chatHub";

export function ReporteDoss() {
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    const datosGuardados =
      JSON.parse(localStorage.getItem("evaluaciones")) || [];
    setEvaluaciones(datosGuardados);
  }, []);

  const parametros = [...new Set(evaluaciones.map((ev) => ev.parametro))];
  const candidatos = [...new Set(evaluaciones.map((ev) => ev.candidato))];

  const imprimirReporte = () => {
    window.print();
  };

  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/seleccion" title2="Home" link2="/" />
      <h1 className="title">Reporte de Evaluación Cruzada</h1>
      <table>
        <thead>
          <tr>
            <th>Candidato</th>
            {parametros.map((p, i) => (
              <th key={i}>{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidatos.map((c, i) => (
            <tr key={i}>
              <td>{c}</td>
              {parametros.map((p, j) => {
                const ev = evaluaciones.find(
                  (e) => e.candidato === c && e.parametro === p
                );
                return <td key={j}>{ev ? ev.calificacion : "-"}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={imprimirReporte}>Imprimir Reporte</button>
      <HelpChat />
    </div>
  );
}
