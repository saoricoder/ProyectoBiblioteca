import React, { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import { Insertar, ObtenerDatos } from "../../../services/general/useFetch";
import {
  BuscarBase,
  EliminarBase,
  ModificarBase,
} from "../../../services/general/crud.service";
import HelpChat from "../../../moduls/chatHub";

export function LibroPage() {
  const API_URL =
    process.env.REACT_APP_API_URL || "https://localhost:7015/api/";
  const url = `${API_URL}Biblioteca/libros`; // Asegúrate de que esta URL esté correcta.
  const [autores, setAutores] = useState([]);
  const [data, setData] = useState([]);
  const [isbn, setIsbn] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autorCodigo, setAutorCodigo] = useState(0);
  const [valorPrestamo, setValorPrestamo] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [busqueda, setBusqueda] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Función para generar un ISBN automáticamente
  const GenerarISBN = () => {
    let isbnGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return isbnGenerado.toString();
  };

  const Guardar = async () => {
    setError(null); // Limpiar errores previos
    setResultados(""); // Limpiar resultados previos
    // Validar que los campos no estén vacíos
    if (!isbn || !autorCodigo || !titulo || !valorPrestamo) {
      console.log("Debe completar los campos.");
      setError("Debe completar los campos.");
      return;
    }
    // Crear un objeto con los datos del libro
    setIsLoading(true); // Deshabilitar el botón de guardar mientras se realiza la solicitud
    const data = {
      isbn,
      autorCodigo,
      titulo,
      valorPrestamo,
    };

    try {
      const result = await Insertar("POST", url, data);

      if (result.success) {
        console.log(result.message);
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

  const ModificarDatos = async () => {
    setLoading(true); // Empieza el loading
    setError(null);
    setResultados("");

    let params = {};

    // Llenamos 'params' con los valores proporcionados

    if (isbn && isbn !== "0") {
      params.isbn = isbn;
    }

    if (autorCodigo) {
      params.autorCodigo = autorCodigo;
    }

    if (titulo) {
      params.titulo = titulo;
    }

    if (valorPrestamo) {
      params.valorPrestamo = valorPrestamo;
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
    setAutorCodigo("");
    setTitulo("");
    setValorPrestamo("");
    setIsbn(GenerarISBN());
  };

  //buscar datos
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
    if (isbn && isbn !== "0") {
      params.isbn = isbn;
    }

    if (titulo) {
      params.titulo = titulo;
    }

    if (autorCodigo && autorCodigo !== "todos") {
      // Añadir el tipo de cuenta si se ha proporcionado
      params.autorCodigo = parseInt(autorCodigo);
    }

    // Validar que al menos uno de los parámetros fue proporcionado
    if (Object.keys(params).length === 0) {
      setLoading(false);
      setIsLoading(false);
      setError(
        "Debe ingresar un código, un nombre o un Autor para realizar la búsqueda."
      );
      return;
    }

    console.log("Buscando con parámetros:", {
      isbn,
      titulo,
      autorCodigo,
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

  //Obtner libros para llenar en la lista
  const fetchObtenerAutores = async () => {
    setLoading(true); // Iniciar loading
    const urlAutores = "https://localhost:7015/api/Biblioteca/autores";
    try {
      const response = await ObtenerDatos(urlAutores); // Reemplaza con la URL de tu API
      if (response.success) {
        // Asumiendo que la API devuelve un array de objetos con 'id' y 'nombre'
        setAutores(response.data); // Establecer los datos de la respuesta
        console.log("Autores cargados:", response.data);
      } else {
        setError("Hubo un error al cargar los datos.");
        console.error(response.message); // Mostrar el mensaje de error retornado por ObtenerDatos
      }
    } catch (error) {
      setError("Hubo un error al cargar los datos.");
      console.error(error);
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  //Funcion Eliminar
  const EliminarDatos = async () => {
    if (!isbn || isbn === "0") {
      console.log("No se ha ingresado un código");
      return;
    }
    console.log("Eliminando código:", isbn);
    await EliminarBase(url, isbn);
    setIsbn(GenerarISBN());
    setAutorCodigo("");
    setTitulo("");
    setValorPrestamo("");
    await ActualizarDatos();
  };

  //editar datos boton
  const editar = (isbn, titulo, autor, valorPrestamo) => {
    console.log("Editar código:", isbn);
    console.log("Editar nombre:", titulo);
    // Implementar la lógica de edición aquí
    setIsbn(isbn);
    setTitulo(titulo);
    setAutorCodigo(autor);
    setValorPrestamo(valorPrestamo);
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
    await EliminarBase(url, codigo);
    await ActualizarDatos();
    setIsbn(GenerarISBN());
    setTitulo("");
    setAutorCodigo("");
    setValorPrestamo("");
  };

  // Cargar libros y autores al montar el componente
  useEffect(() => {
    setIsbn(GenerarISBN()); // Generar un ISBN al cargar la página
    fetchObtenerAutores();
  }, []);

  return (
    <div className="container">
      <MenuHeader
        menuItems={[
          { title: "Atrás", link: "/biblioteca" },
          { title: "Home", link: "/home" }
        ]}
      />
      <h1>Libros</h1>
      <div className="form_container">
        <form className="form_libros">
          <div className="item_container">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              name="isbn"
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              name="titulo"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="item_container">
            <label htmlFor="autor">Autor</label>
            {autores.length > 0 ? (
              <select
                name="autor"
                id="autor"
                value={autorCodigo}
                onChange={(e) => setAutorCodigo(e.target.value)}
                defaultValue=""
              >
                <option key="default" value="">
                  Seleccionar Autor
                </option>
                {autores.map((autor) => (
                  <option key={autor.codigo} value={autor.codigo}>
                    {autor.nombre} {autor.apellido}
                  </option>
                ))}
              </select>
            ) : (
              <select name="autor" id="autor">
                <option key="no-data" value="Vacio">
                  No hay datos
                </option>
              </select>
            )}
          </div>

          <div className="item_container">
            <label htmlFor="valorPrestamo">Valor Préstamo</label>
            <input
              type="number"
              name="valorPrestamo"
              id="valorPrestamo"
              value={valorPrestamo}
              onChange={(e) => setValorPrestamo(e.target.value)}
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

        {/* Mostramos la tabla solo si hay datos */}
        {Array.isArray(data) && data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Valor Préstamo</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.isbn}</td>
                  <td>{item.autorCodigo}</td>
                  <td>{item.titulo}</td>
                  <td>{item.valorPrestamo}</td>
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
          // Mostrar un mensaje si no hay datos
          resultados && <p>{resultados}</p>
        )}
      </div>
      <HelpChat />
    </div>
  );
}

export default LibroPage;
