import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import HelpChat from "../../../moduls/chatHub";

export function SimpleDoss() {
  const [parametros, setParametros] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [puntajeMaximo, setPuntajeMaximo] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("parametros")) || [];
    setParametros(datosGuardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("parametros", JSON.stringify(parametros));
  }, [parametros]);

  const agregarParametro = () => {
    if (codigo && nombre && puntajeMaximo) {
      setParametros([
        ...parametros,
        { codigo, nombre, puntajeMaximo: Number(puntajeMaximo) },
      ]);
      setCodigo("");
      setNombre("");
      setPuntajeMaximo("");
    }
  };

  const eliminarParametro = (codigo) => {
    setParametros(parametros.filter((p) => p.codigo !== codigo));
  };

  const modificarParametro = (index) => {
    const parametroModificado = parametros[index];
    setCodigo(parametroModificado.codigo);
    setNombre(parametroModificado.nombre);
    setPuntajeMaximo(parametroModificado.puntajeMaximo);
    setParametros(parametros.filter((_, i) => i !== index));
  };

  const parametrosFiltrados = parametros.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/seleccion" title2="Home" link2="/" />
      <h1 className="title">Parámetros de Evaluación</h1>
      <div className="form_container">
        <form className="form_parametros">
          <div className="item_container">
            <label>Código</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Nombre del Parámetro</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label>Puntaje Máximo</label>
            <input
              type="number"
              value={puntajeMaximo}
              onChange={(e) => setPuntajeMaximo(e.target.value)}
            />
          </div>
          <input type="button" value="Insertar" onClick={agregarParametro} />
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
            <th>Código</th>
            <th>Nombre</th>
            <th>Puntaje Máximo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parametrosFiltrados.map((p, index) => (
            <tr key={index}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{p.puntajeMaximo}</td>
              <td>
                <button onClick={() => modificarParametro(index)}>
                  Modificar
                </button>
                <button onClick={() => eliminarParametro(p.codigo)}>
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
