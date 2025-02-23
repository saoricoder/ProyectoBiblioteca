import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import HelpChat from "../../../moduls/chatHub";

export function SimpleUnos() {
  const [candidatos, setCandidatos] = useState([]);
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("candidatos")) || [];
    setCandidatos(datosGuardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("candidatos", JSON.stringify(candidatos));
  }, [candidatos]);

  const agregarCandidato = () => {
    if (cedula && nombre && fechaNacimiento) {
      setCandidatos([...candidatos, { cedula, nombre, fechaNacimiento }]);
      setCedula("");
      setNombre("");
      setFechaNacimiento("");
    }
  };

  const eliminarCandidato = (cedula) => {
    setCandidatos(candidatos.filter((c) => c.cedula !== cedula));
  };

  const modificarCandidato = (index) => {
    const candidatoModificado = candidatos[index];
    setCedula(candidatoModificado.cedula);
    setNombre(candidatoModificado.nombre);
    setFechaNacimiento(candidatoModificado.fechaNacimiento);
    setCandidatos(candidatos.filter((_, i) => i !== index));
  };

  const candidatosFiltrados = candidatos.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/seleccion" title2="Home" link2="/" />
      <h1 className="title">Registro de Candidatos</h1>
      <div className="form_container">
        <form className="form_candidato">
          <div className="item_container">
            <label>Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          <input type="button" value="Insertar" onClick={agregarCandidato} />
        </form>
      </div>
      <div className="search_container">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Fecha de Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {candidatosFiltrados.map((c, index) => (
            <tr key={index}>
              <td>{c.cedula}</td>
              <td>{c.nombre}</td>
              <td>{c.fechaNacimiento}</td>
              <td>
                <button onClick={() => modificarCandidato(index)}>
                  Modificar
                </button>
                <button onClick={() => eliminarCandidato(c.cedula)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <HelpChat />
    </div>
  );
}
