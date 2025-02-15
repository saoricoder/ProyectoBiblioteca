import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import {Insertar,Eliminar,ObtenerDatosPorId,BuscarPorParam,} from "../../../services/general/useFetch";

export function AutorPage() {
  const url = "http://localhost:5261/api/Biblioteca/autores"; // Asegúrate de que esta URL esté correcta.

  const [codigo, setCodigo] = useState(0); // Estado para almacenar el código
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [apellido, setApellido] = useState(""); // Estado para almacenar el apellido
  const [data, setData] = useState([]); // Estado para almacenar los auditores
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(false); // Estado de carga
  const [resultados, setResultados] = useState(""); // Estado para almacenar los resultados de la búsqueda
  const [isLoading, setIsLoading] = useState(false); // Estado para deshabilitar el botón de guardar

  // Función para generar el código
  const GenerarCodigo = () => {
    let codigoGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return codigoGenerado;
  };

  // Función eliminar reutilizable
  const EliminarBase = async (codigo) => {
    try {
      const consulta = await ObtenerDatosPorId(url, codigo);
      if (!consulta.success) {
        console.log(consulta.message);
        return;
      }

      const result = await Eliminar(url, codigo);
      if (result.success) {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  // Función para buscar los datos
  const Buscar = async () => {
    setLoading(true);
    setError(null);
    setResultados("");

    const codigoValue = document.getElementById("codigo").value;
    const nombreValue = document.getElementById("nombre").value;
    const apellidoValue = document.getElementById("apellido").value;
    let params = {};

    if (codigoValue && codigoValue !== "0") params.codigo = codigoValue;
    if (nombreValue) params.nombre = nombreValue;
    if (apellidoValue) params.apellido = apellidoValue;

    if (Object.keys(params).length === 0) {
      setLoading(false);
      setError("Debe ingresar al menos un parámetro para buscar.");
      return;
    }

    await BuscarPorParam(url, params);
    setLoading(false);
  };

  // Función para guardar los datos
  const Guardar = async () => {
    if (!codigo || !nombre || !apellido) {
      setError("Debe completar todos los campos.");
      return;
    }

    setIsLoading(true);
    const data = { codigo, nombre, apellido };

    try {
      const result = await Insertar("POST", url, data);
      if (result.success) {
        setCodigo(GenerarCodigo());
        setNombre("");
        setApellido("");
      } else {
        setError(result.message || "Hubo un error al guardar los datos.");
      }
    } catch (error) {
      setError("Hubo un problema al intentar guardar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para modificar los datos
  const Modificar = async () => {
    setLoading(true);
    setError(null);

    const codigoValue = document.getElementById("codigo").value;
    const nombreValue = document.getElementById("nombre").value;
    const apellidoValue = document.getElementById("apellido").value;

    const params = {
      codigo: codigoValue,
      nombre: nombreValue,
      apellido: apellidoValue,
    };

    /*const result = await ModificarBase(url, params);

    if (result.success) {
      setResultados("Datos modificados con éxito.");
    } else {
      setResultados(result.message || "Error al modificar los datos.");
    }*/

    setLoading(false);
  };

  // Función para eliminar datos
  const EliminarDatos = async () => {
    const codigo = document.getElementById("codigo").value;
    if (!codigo || codigo === "0") {
      console.log("No se ha ingresado un código");
      return;
    }

    await EliminarBase(codigo);
    setCodigo(GenerarCodigo());
    setNombre("");
    setApellido("");
  };

  useEffect(() => {
    setCodigo(GenerarCodigo());
  }, []);

  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/biblioteca"
        title2="Home"
        link2="/home"
      />
      <h1 className="title">Crear Autor de Libro</h1>
      <div className="form_container">
        <form className="form_auditores">
          <div className="item_container">
            <label htmlFor="codigo">Codigo</label>
            <input
              type="text"
              name="codigo"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              name="apellido"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <input
            type="button"
            value="Insertar"
            onClick={Guardar}
            disabled={isLoading}
          />
          <input
            type="button"
            value="Eliminar"
            onClick={EliminarDatos}
            disabled={isLoading}
          />
          <input
            type="button"
            value="Modificar"
            onClick={Modificar}
            disabled={isLoading}
          />
          <input
            type="button"
            value="Buscar"
            onClick={Buscar}
            disabled={isLoading}
          />
        </form>
      </div>
      <div className="resultado">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {resultados && <p>{resultados}</p>}

        {Array.isArray(data) && data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>{item.apellido}</td>
                  <td>
                    <button onClick={() => setCodigo(item.codigo)}>
                      Editar
                    </button>
                    <button onClick={() => EliminarBase(item.codigo)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default AutorPage;