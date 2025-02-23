import { useState, useEffect } from "react";
import { MenuHeader } from "../../../moduls/Menu_header";
import { Insertar, ObtenerDatos } from "../../../services/general/useFetch";
import {
  EliminarBase,
  BuscarBase,
  ModificarBase,
} from "../../../services/general/crud.service";
import HelpChat from "../../../moduls/chatHub";

export function SimpleDos() {
  const [codigo, setCodigo] = useState(0); //Codigo de la cuenta
  const [nombre, setNombre] = useState(""); //Nombre de la cuenta
  const [tipoCuenta, setTipoCuenta] = useState([]); //Tipo de cuenta
  const [tipoCuentaSeleccionado, setTipoCuentaSeleccionado] = useState(""); //Tipo de cuenta seleccionado
  const [saldo, setSaldo] = useState(0); //saldo de la cuenta
  const [data, setData] = useState([]); //Datos de la cuenta
  const [loading, setLoading] = useState(false); //Cargando
  const [error, setError] = useState(null); //Error
  const [resultados, setResultados] = useState(""); //Resultado de la operacion
  const [isLoading, setIsLoading] = useState(false); //Cargando
  const url = "http://localhost:5286/api/Contabilidad/cuenta";
  const [busqueda, setBusqueda] = useState([]);

  //Funcion para Generar el codigo
  const GenerarCodigo = () => {
    let codigoGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return codigoGenerado;
  };

  //funcion Guardar
  const Guardar = async () => {
    setError(null); // Limpiar errores previos
    setResultados(""); // Limpiar resultados previos
    // Validar que los campos no estén vacíos
    if (!codigo || !nombre || !tipoCuentaSeleccionado) {
      console.log("Debe completar los campos.");
      setError("Debe completar los campos.");
      return;
    }
    console.log(tipoCuentaSeleccionado);
    setIsLoading(true); // Deshabilitar el botón de guardar mientras se realiza la solicitud
    const data = {
      codigo,
      nombre,
      tipoDeCuenta: tipoCuentaSeleccionado,
      saldo,
    };

    try {
      const result = await Insertar("POST", url, data);

      if (result.success) {
        console.log(result.message);
        setCodigo(GenerarCodigo());
        setNombre("");
        setTipoCuentaSeleccionado("");
        setSaldo(0);
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

  //Funcion Eliminar
  const EliminarDatos = async () => {
    if (!codigo || codigo === "0") {
      console.log("No se ha ingresado un código");
      return;
    }
    console.log("Eliminando código:", codigo);
    await EliminarBase(url, codigo);
    setCodigo(GenerarCodigo());
    setNombre("");
    await ActualizarDatos();
  };

  //editar datos boton
  const editar = (codigo, nombre, cuenta, saldo) => {
    console.log("Editar código:", codigo);
    console.log("Editar nombre:", nombre);
    // Implementar la lógica de edición aquí
    setCodigo(codigo);
    setNombre(nombre);
    setTipoCuentaSeleccionado(cuenta);
    setSaldo(saldo);
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
    setCodigo(GenerarCodigo());
    setNombre("");
    setTipoCuentaSeleccionado("");
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
    if (codigo && codigo !== "0") {
      params.codigo = codigo;
    }

    if (nombre) {
      params.nombre = nombre;
    }

    if (tipoCuentaSeleccionado && tipoCuentaSeleccionado !== "todos") {
      // Añadir el tipo de cuenta si se ha proporcionado
      params.tipoDeCuenta = tipoCuentaSeleccionado;
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
      tipoDeCuenta: tipoCuentaSeleccionado,
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
    if (tipoCuentaSeleccionado) {
      params.tipoDeCuenta = tipoCuentaSeleccionado;
    }
    if (saldo) {
      params.saldo = saldo;
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
  };

  //obtener los tipos de cuenta para el llenada de la lista
  const fetchTiposCuenta = async () => {
    setLoading(true); // Iniciar loading
    const urlTipoCuenta = "http://localhost:5286/api/Contabilidad/tipodecuenta";
    try {
      const response = await ObtenerDatos(urlTipoCuenta); // Reemplaza con la URL de tu API
      if (response.success) {
        // Asumiendo que la API devuelve un array de objetos con 'id' y 'nombre'
        setTipoCuenta(response.data); // Establecer los datos de la respuesta
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

  //useEffect para cargar datos al iniciar la pagina
  useEffect(() => {
    setCodigo(GenerarCodigo());
    fetchTiposCuenta();
  }, []);

  // Ejecutar cada vez que tipoCuenta cambie
  /*  useEffect(() => {
    // Si `tipoCuenta` tiene datos y `tipoCuentaSeleccionado` está vacío
    if (tipoCuenta.length > 0 && tipoCuentaSeleccionado === "") {
      setTipoCuentaSeleccionado(tipoCuenta[0].nombre); // Asigna el primer tipo de cuenta
    }
  }, [tipoCuenta, tipoCuentaSeleccionado]); */
  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/contabilidad"
        title2="Home"
        link2="/"
      />
      <h1 className="title">Cuentas</h1>
      <div className="form_container">
        <form action="" className="form_cuentas">
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
            <label htmlFor="tipodecuenta">Tipo de Cuenta</label>
            {tipoCuenta.length > 0 ? (
              <select
                name="tipodecuenta"
                id="tipodecuenta"
                onChange={(e) => setTipoCuentaSeleccionado(e.target.value)}
                defaultValue=""
              >
                <option key="12345" value="">
                  Todos
                </option>
                {tipoCuenta.map((tipo) => (
                  <option key={tipo.codigo} value={tipo.nombre}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <select name="tipodecuenta" id="tipodecuenta">
                <option key="0001" value="Vacio">
                  No Hay datos
                </option>
              </select>
            )}
          </div>
          <div className="item_container">
            <label htmlFor="nombre">Saldo</label>
            <input
              type="text"
              name="saldo"
              id="saldo"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
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
                <th>Código</th>
                <th>Nombre</th>
                <th>Tipo De Cuenta</th>
                <th>Saldo</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>{item.tipoDeCuenta}</td>
                  <td>{item.saldo}</td>
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
