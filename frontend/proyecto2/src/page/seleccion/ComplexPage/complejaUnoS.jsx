import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import HelpChat from "../../../moduls/chatHub";

export function ComplexUnos() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [candidato, setCandidato] = useState("");
  const [parametro, setParametro] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [cantidadContratar, setCantidadContratar] = useState(0);
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const datosGuardados =
      JSON.parse(localStorage.getItem("evaluaciones")) || [];
    setEvaluaciones(datosGuardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("evaluaciones", JSON.stringify(evaluaciones));
  }, [evaluaciones]);

  const agregarEvaluacion = () => {
    if (calificacion > 100) {
      alert("La calificación no puede ser mayor a 100.");
      return;
    }
    setEvaluaciones([
      ...evaluaciones,
      {
        numero,
        fecha,
        candidato,
        parametro,
        calificacion: Number(calificacion),
      },
    ]);
    setNumero("");
    setFecha("");
    setCandidato("");
    setParametro("");
    setCalificacion("");
  };

  const contratar = () => {
    const topCandidatos = evaluaciones
      .reduce((acc, ev) => {
        let index = acc.findIndex((c) => c.candidato === ev.candidato);
        if (index !== -1) acc[index].total += ev.calificacion;
        else acc.push({ candidato: ev.candidato, total: ev.calificacion });
        return acc;
      }, [])
      .sort((a, b) => b.total - a.total)
      .slice(0, cantidadContratar);

    setEmpleados(topCandidatos);
    localStorage.setItem("empleados", JSON.stringify(topCandidatos));
  };

  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/seleccion" title2="Home" link2="/" />
      <h1 className="title">Evaluación y Contratación</h1>
      <div className="form_container">
        <h2>Evaluación de Candidatos</h2>
        <form className="form_evaluacion">
          <div className="item_container">
            <label>Número</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Candidato</label>
            <input
              type="text"
              value={candidato}
              onChange={(e) => setCandidato(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Parámetro</label>
            <input
              type="text"
              value={parametro}
              onChange={(e) => setParametro(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Calificación</label>
            <input
              type="number"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
            />
          </div>
          <input
            type="button"
            value="Agregar Evaluación"
            onClick={agregarEvaluacion}
          />
        </form>
      </div>
      <div className="form_container">
        <h2>Contratación de Candidatos</h2>
        <label>¿Cuántos empleados desea contratar?</label>
        <input
          type="number"
          value={cantidadContratar}
          onChange={(e) => setCantidadContratar(e.target.value)}
        />
        <input type="button" value="Contratar" onClick={contratar} />
        <h2>Empleados Contratados</h2>
        <ul>
          {empleados.map((e, i) => (
            <li key={i}>
              {e.candidato} - {e.total} puntos
            </li>
          ))}
        </ul>
      </div>
      <HelpChat />
    </div>
  );
}
