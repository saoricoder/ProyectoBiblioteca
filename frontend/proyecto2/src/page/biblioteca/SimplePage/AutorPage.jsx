import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import {
  Insertar,
  Eliminar,
  ObtenerDatosPorId,
  BuscarPorParam,
} from "../../../services/general/useFetch";
import HelpChat from "../../../moduls/chatHub";

export function AutorPage() {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://localhost:7015/api/";
  const url = `${API_URL}Biblioteca/autores`; // Asegúrate de que esta URL esté correcta.

  const [codigo, setCodigo] = useState(0); // Estado para almacenar el código
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [apellido, setApellido] = useState(""); // Estado para almacenar el apellido
  const [data, setData] = useState([]); // Estado para almacenar los auditores
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(false); // Estado de carga
  const [busqueda, setBusqueda] = useState({}); // Estado para almacenar los parámetros de búsqueda
  const [resultados, setResultados] = useState(""); // Estado para almacenar los resultados de la búsqueda
  const [isLoading, setIsLoading] = useState(false); // Estado para deshabilitar el botón de guardar

  // Función para generar el código
  const GenerarCodigo = () => {
    let codigoGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return codigoGenerado;
  };

  const Guardar = async () => {
    // Validar que los campos no estén vacíos
    if (!codigo || !nombre || !apellido) {
      console.log("Debe completar los campos.");
      setError("Debe completar los campos.");
      return;
    }

    setIsLoading(true); // Deshabilitar el botón de guardar mientras se realiza la solicitud
    const data = { codigo, nombre, apellido };

    try {
      const result = await Insertar("POST", url, data);

      if (result.success) {
        console.log(result.message);
        setCodigo(GenerarCodigo());
        setNombre("");
        setApellido("");
        setError(null);
      } else {
        console.error(result.message, result.error);
        setError(result.message || "Hubo un error al guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setError("Hubo un problema al intentar guardar los datos.");
    } finally {
      setIsLoading(false); // Volver a habilitar el botón después de la solicitud
      setError(null);
    }
  };
  const EliminarDatos = async () => {
    const codigo = document.getElementById("codigo").value;

    if (!codigo || codigo === "0") {
      console.log("No se ha ingresado un código");
      return;
    }

    await EliminarBase(codigo);
    setCodigo(GenerarCodigo());
    setNombre("");
  };
  const ModificarBase = async (url, params = {}) => {
    try {
      const { codigo, nombre, apellido } = params;

      // Establece la URL correctamente, asegurándote de incluir el 'id' en la URL
      const fullUrl = `${url}/${params.codigo}`; // usa params.codigo como id

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo, // Incluye los campos modificados
          nombre, // Incluye los campos modificados
          apellido, // Incluye los campos modificados
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        message: "Datos modificados con éxito.",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "No se pudo modificar los datos.",
        error: error.message,
      };
    }
  };
  const BuscarBase = async (url, params) => {
    try {
      // Realizar la búsqueda con los parámetros
      const result = await BuscarPorParam(url, params);

      // Manejo del resultado
      if (result.success) {
        if (result.data && result.data.length > 0) {
          // Filtrar los resultados según los parámetros proporcionados
          let filteredResults = result.data;
          // Filtrar por código si está presente
          if (params.codigo && params.codigo !== "") {
            filteredResults = filteredResults.filter(
              (item) => item.codigo && item.codigo.toString() === params.codigo
            );
          }
          // Filtrar por nombre si está presente
          if (params.nombre && params.nombre !== "") {
            filteredResults = filteredResults.filter(
              (item) =>
                item.nombre &&
                item.nombre.toLowerCase().includes(params.nombre.toLowerCase())
            );
          }

          // Si se encontraron resultados filtrados
          if (filteredResults.length > 0) {
            console.log(
              "Resultado encontrado con los parámetros dados:",
              filteredResults
            );
            return {
              success: true,
              message: "Datos obtenidos con éxito.",
              data: filteredResults, // Mostrar los resultados filtrados
            };
          } else {
            console.log(
              "No se encontró un resultado que coincida con los parámetros."
            );
            return "No se encontró un resultado que coincida con los parámetros.";
          }
        } else {
          // Si no hay datos en la respuesta
          console.log(
            "No se encontraron resultados para los parámetros proporcionados."
          );
          setResultados(
            "No se encontraron resultados para los parámetros proporcionados."
          );
          setError(null); // Resetear error
        }
      } else {
        // Si la respuesta es exitosa pero no contiene datos
        console.log(result.message || "No se encontraron RESULTADOS.");
        return result.message || "No se encontraron resultados.";
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      return "Ocurrió un error al realizar la búsqueda.";
    }
  };
  const EliminarBase = async (codigo) => {
    try {
      const consulta = await ObtenerDatosPorId(url, codigo);
      if (!consulta.success) {
        console.log(consulta.message);
        console.log(consulta.error);
        return;
      }

      if (consulta.data && consulta.data.length === 0) {
        console.log("No se encontraron datos");
        return;
      } else {
        console.log("Datos encontrados:", consulta.data);
      }

      const result = await Eliminar(url, codigo);
      if (result.success) {
        console.log(result.message);
      } else {
        console.log(result.message);
        console.log(result.error);
        return;
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return;
    }
  };
  //editar datos boton
  const editar = (codigo, nombre, apellido) => {
    console.log("Editar código:", codigo);
    console.log("Editar nombre:", nombre);
    // Implementar la lógica de edición aquí
    setCodigo(codigo);
    setNombre(nombre);
    setApellido(apellido);
  };

  //actualiozar datos
  const ActualizarDatos = async () => {
    if (Object.keys(busqueda).length === 0) {
      setData([]);
      return;
    }
    try {
      // Llamar a la función de búsqueda con los parámetros
      const result = await BuscarBase(url, busqueda);

      console.log("Resultado de la búsqueda:", result);
      // Aquí podrías manejar los resultados de la búsqueda, si es necesario
      if (result && result.success) {
        console.log("Resultados de la búsqueda:", result.data);
        setData(result.data);
        setBusqueda(busqueda);
      } else {
        console.log(result.message || "No se encontraron resultados.");
        setResultados("");
        setBusqueda([]);
        setData([]);
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      setError("Ocurrió un error al realizar la búsqueda.");
    } finally {
      // Detener los estados de carga, sin importar si hubo éxito o error
      setLoading(false);
      setIsLoading(false);
    }
  };

  //eliminar datos boton
  const EliminarDatosBoton = async (codigo) => {
    console.log("Eliminar código:", codigo);

    // Implementar la lógica de eliminación aquí
    await EliminarBase(codigo);
    await ActualizarDatos();
    setCodigo(GenerarCodigo());
    setNombre("");
    setApellido("");
  };
  // Función para buscar los datos
  const Buscar = async () => {
    setBusqueda([]);
    setData([]);
    // Iniciar estados de carga y limpiar cualquier error previo
    setLoading(true);
    setIsLoading(true);
    setError(null);
    setResultados("");

    // Inicializar parámetros de búsqueda
    let params = {};

    // Llenar 'params' solo con los valores proporcionados
    if (codigo && codigo !== "0") {
      params.codigo = codigo;
    }

    if (nombre) {
      params.nombre = nombre;
    }

    // Validar que al menos uno de los parámetros fue proporcionado
    if (Object.keys(params).length === 0) {
      setLoading(false);
      setIsLoading(false);
      setError(
        "Debe ingresar un código, un nombre o un tipo de cuenta para realizar la búsqueda."
      );
      return;
    }

    console.log("Buscando con parámetros:", {
      codigo,
      nombre,
    });
    try {
      // Llamar a la función de búsqueda con los parámetros
      const result = await BuscarBase(url, params);

      console.log("Resultado de la búsqueda:", result);
      // Aquí podrías manejar los resultados de la búsqueda, si es necesario
      if (result && result.success) {
        console.log("Resultados de la búsqueda:", result.data);
        setData(result.data);
        setBusqueda(params);
      } else {
        console.log(result.message || "No se encontraron resultados.");
        setResultados(result.message || "No se encontraron resultados.");
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      setError("Ocurrió un error al realizar la búsqueda.");
    } finally {
      // Detener los estados de carga, sin importar si hubo éxito o error
      setLoading(false);
      setIsLoading(false);
    }
  };

  const ModificarDatos = async () => {
    setLoading(true); // Empieza el loading
    setError(null);
    setResultados("");

    let params = {};

    // Llenamos 'params' con los valores proporcionados

    if (codigo && codigo !== "0") {
      params.codigo = codigo;
    }

    if (nombre) {
      params.nombre = nombre;
    }
    if (apellido) {
      params.apellido = apellido;
      console.log("Apellido:", apellido);
    }

    // Validar que al menos uno de los parámetros fue proporcionado
    if (Object.keys(params).length === 0) {
      setLoading(false);
      setError("Debe ingresar los parámetros para modificar.");
      return;
    }

    try {
      // Realizamos la solicitud PUT para modificar los datos
      const result = await ModificarBase(url, params);
      console.log("Modificando con parámetros:", {
        params,
      });
      if (result && result.success) {
        // Si la modificación fue exitosa
        console.log("Datos modificados exitosamente.");
        setResultados("Datos modificados con éxito.");
        setData(result.data); // Muestra los datos modificados
      } else {
        // Si hubo un error durante la actualización
        console.log(result?.message || "Error al modificar los datos.");
        setResultados(result?.message || "Error desconocido.");
        setError(null);
      }
    } catch (error) {
      console.log("Error en la modificación:", error);
      setError("Ocurrió un error al intentar modificar los datos.");
    }

    setLoading(false); // Detener loading
    setCodigo(GenerarCodigo()); // Actualizar el código
    setNombre(""); // Limpiar el nombre
    setApellido(""); // Limpiar el apellido
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
            onClick={ModificarDatos}
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
                    <button
                      onClick={() =>
                        editar(item.codigo, item.nombre, item.apellido)
                      }
                    >
                      Editar
                    </button>
                    <button onClick={() => EliminarDatosBoton(item.codigo)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Mostramos los resultados de la búsqueda */
          resultados && <p>{resultados}</p>
        )}
      </div>
      <HelpChat />
    </div>
  );
}

export default AutorPage;
