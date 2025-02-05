import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import {
  Insertar,
  Eliminar,
  ObtenerDatosPorId,
  BuscarPorParam,
} from "../../../moduls/useFetch";

export function SimpleUno() {
  const url = "http://localhost:5261/api/Contabilidad/tipodecuenta";

  const [codigo, setCodigo] = useState(0); // Estado para almacenar el código
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [data, setData] = useState([]); // Estado para almacenar el tipo de cuenta (CORREGIDO)
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

  //Funcion Buscar Base
  const BuscarBase = async (codigoValue, nombreValue, params) => {
    try {
      // Realizar la búsqueda con los parámetros
      const result = await BuscarPorParam(url, params);

      // Manejo del resultado
      if (result.success) {
        if (result.data && result.data.length > 0) {
          // Filtrado de resultados por ambos parámetros
          if (codigoValue && nombreValue) {
            const filteredResults = result.data.filter(
              (item) => item.nombre.toLowerCase() === nombreValue.toLowerCase()
            );

            if (filteredResults.length > 0) {
              console.log(
                "Resultado encontrado con ambos parámetros (código y nombre):",
                filteredResults
              );
              setData(filteredResults); // Mostrar los resultados filtrados
            } else {
              console.log(
                "No se encontró un resultado que coincida con el código y el nombre."
              );
              setResultados(
                "No se encontró un resultado que coincida con el código y el nombre."
              );
              setError(null); // Resetear error si no hubo coincidencia
            }
          } else {
            console.log(
              "Resultado encontrado con los parámetros dados:",
              result.data
            );
            setData(result.data); // Mostrar resultados sin filtrado (solo uno de los parámetros)
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
        // Si la respuesta es exitosa pero no contiene datos (esto también puede venir de la API)
        console.log(result.message || "No se encontraron resultados.");
        setResultados(result.message || "No se encontraron resultados.");
        setError(null);
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setError("Ocurrió un error al realizar la búsqueda.");
      setResultados(""); // Limpiar cualquier resultado previo
    }
  };

  //Funcion Modificar Base
  const ModificarBase = async (url, params = {}) => {
    try {
      const { codigo, nombre } = params;

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

  // Función para guardar los datos
  const Guardar = async () => {
    // Validar que los campos no estén vacíos
    if (!codigo || !nombre) {
      console.log("Debe completar los campos.");
      setError("Debe completar los campos.");
      return;
    }

    setIsLoading(true); // Deshabilitar el botón de guardar mientras se realiza la solicitud
    const data = { codigo, nombre };

    try {
      const result = await Insertar("POST", url, data);

      if (result.success) {
        console.log(result.message);
        setCodigo(GenerarCodigo());
        setNombre("");
      } else {
        console.error(result.message, result.error);
        setError(result.message || "Hubo un error al guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setError("Hubo un problema al intentar guardar los datos.");
    } finally {
      setIsLoading(false); // Volver a habilitar el botón después de la solicitud
    }
  };

  // Función para eliminar los datos
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

  //editar datos boton
  const editar = (codigo, nombre) => {
    console.log("Editar código:", codigo);
    console.log("Editar nombre:", nombre);
    // Implementar la lógica de edición aquí
    setCodigo(codigo);
    setNombre(nombre);
  };

  //eliminar datos boton
  const EliminarDatosBoton = async (codigo) => {
    console.log("Eliminar código:", codigo);
    const code = document.getElementById("codigo").value;
    const name = document.getElementById("name").value;

    // Implementar la lógica de eliminación aquí
    await EliminarBase(codigo);
    await BuscarBase(code, name);
  };

  // Función para buscar los datos
  const Buscar = async () => {
    setLoading(true);
    setError(null);
    setResultados("");

    const codigoValue = document.getElementById("codigo").value;
    const nombreValue = document.getElementById("name").value;
    let params = {};

    // Llenar 'params' solo con los valores proporcionados
    if (codigoValue && codigoValue !== "0") {
      params.codigo = codigoValue;
    }

    if (nombreValue) {
      params.nombre = nombreValue;
    }

    // Validar que al menos uno de los parámetros fue proporcionado
    if (Object.keys(params).length === 0) {
      setLoading(false);
      setError(
        "Debe ingresar un código o un nombre para realizar la búsqueda."
      );
      return;
    }
    console.log("Buscando con parámetros:", { codigoValue, nombreValue });
    await BuscarBase(codigoValue, nombreValue, params);
    setLoading(false);
  };

  //Funcion para modificar

  const ModificarDatos = async () => {
    setLoading(true); // Empieza el loading
    setError(null);
    setResultados("");

    const codigoValue = document.getElementById("codigo").value;
    const nombreValue = document.getElementById("name").value;

    console.log("Modificando con parámetros:", {
      codigoValue,
      nombreValue,
    });

    let params = {};

    // Llenamos 'params' con los valores proporcionados
    if (codigoValue && codigoValue !== "0") {
      params.codigo = codigoValue;
    }

    if (nombreValue) {
      params.nombre = nombreValue;
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
  };

  // useEffect para cargar los datos al inicio
  useEffect(() => {
    setCodigo(GenerarCodigo()); // Actualizamos el código al cargar el componente
  }, []);

  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/contabilidad"
        title2="Home"
        link2="/"
      />
      <h1 className="title">Tipo de cuenta</h1>
      <div className="form_container">
        <form className="form_tipocuenta">
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
              id="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
        {/* Mostramos el loading mientras se buscan los datos */}
        {loading && <p>Loading...</p>}

        {/* Mostramos el error si existe */}
        {error && <p>Error: {error}</p>}
        {/* Mostramos los resultados de la búsqueda */}
        {resultados && <p>{resultados}</p>}

        {/* Mostramos la tabla solo si hay datos */}
        {Array.isArray(data) && data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>
                    {/* Botones para editar y eliminar */}
                    <button onClick={() => editar(item.codigo, item.nombre)}>
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
          ""
        )}
      </div>
    </div>
  );
}
