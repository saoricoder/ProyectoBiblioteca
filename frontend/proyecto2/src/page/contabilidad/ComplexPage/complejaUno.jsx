import { MenuHeader } from "../../../moduls/Menu_header";
import "../../../css/contabilidad/comprobante.css";
import { useState, useEffect } from "react";
import {
  Insertar,
  ObtenerDatos,
  ObtenerDatosPorId,
} from "../../../moduls/useFetch";
import {
  BuscarBase,
  EliminarRegistro,
  ModificarComprobante,
} from "../../../moduls/comprobante.service";
import { EliminarBase, ModificarBase } from "../../../moduls/crud.service";

export function ComplexUno() {
  const [numero, setNumero] = useState(0);
  const [fecha, setFecha] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [debe, setDebe] = useState("");
  const [cuenta, setCuenta] = useState([]);
  const [haber, setHaber] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");
  const [dataComprobante, setDataComprobante] = useState([]);
  const [dataDetalle, setDataDetalle] = useState([]);
  const [loading, setLoading] = useState(false); //Cargando
  const [error, setError] = useState(null); //Error
  const [resultadoComprobante, setResultadoComprobante] = useState(""); //Resultado de la operacion
  const [resultadoDetalle, setResultadoDetalle] = useState("");
  const [isLoading, setIsLoading] = useState(false); //Cargando
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);
  const urlcomprobante = "http://localhost:5261/api/Contabilidad/comprobante";
  const urldetalle =
    "http://localhost:5261/api/Contabilidad/detalle_comprobante";
  const [busqueda, setBusqueda] = useState([]);

  //funcion generar numero de comprobante
  const GenerarCodigo = () => {
    let codigoGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return codigoGenerado;
  };

  //metodo Guardar
  const Guardar = async () => {
    setError(null);
    setResultadoComprobante("");
    // Validar que los campos no estén vacíos
    if (!numero || !fecha) {
      console.log("Debe completar los campos.");
      setError("Debe completar los campos de la cabecera comprobante.");
      return;
    }
    setIsLoading(true); // Deshabilitar el botón de guardar mientras se realiza la solicitud
    let fechanueva = new Date(fecha);
    setFecha(fechanueva.toISOString().split("T")[0]);
    const data = { numero, fecha, observaciones };

    try {
      const result = await Insertar("POST", urlcomprobante, data);

      if (result.success) {
        console.log(result.message);
        setNumero(GenerarCodigo());
        setFecha("");
        setObservaciones("");
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

  //Metodo EliminarDatos
  const EliminarTodosDatos = async (url, codigo) => {
    if (!codigo || codigo === "0") {
      console.log("No se ha ingresado un código");
      return;
    }
    console.log("Eliminando código:", codigo);
    if (url === urlcomprobante) {
      const consult = await ObtenerDatosPorId(urldetalle, codigo);
      if (consult.success) {
        await EliminarBase(urldetalle, codigo);
      }
    }
    await EliminarBase(url, codigo);
    await ActualizarDetalle(numero);
    setNumero(GenerarCodigo());
    setFecha("");
    setObservaciones("");
    setDebe("");
    setCuentaSeleccionada("");
    setHaber("");
    await ActualizarDatos();
  };

  //Eliminar un registro detalle

  const EliminarDetalle = async (url, codigo) => {
    if (!codigo || codigo === "0") {
      console.log("No se ha ingresado un código");
      return;
    }
    console.log("Eliminando detalle código:", codigo);
    await EliminarRegistro(url, codigo);
    setDebe("");
    setCuentaSeleccionada("");
    setHaber("");
    await ActualizarDatos();
  };

  //metodo EliminarDatosBoton
  const EliminarDatosBoton = async (url, id) => {
    console.log("Eliminando desde boton:", id);
    if (url === urlcomprobante) {
      console.log("elimnado comprobante" + id);
      const consult = await ObtenerDatosPorId(urldetalle, id);
      if (!consult.success) {
        console.log(consult.message);
        console.log(consult.error);
        return;
      } else {
        console.log("eliminaod" + id);
        await EliminarTodosDatos(urldetalle, id);
        await EliminarTodosDatos(url, id);
      }
      console.log("VERFIICASKAMSDASKLDNAKLSDNLAS");
      setNumero(GenerarCodigo());
      setFecha("");
      setObservaciones("");
      await ActualizarDatos();
    } else if (url === urldetalle) {
      await EliminarDetalle(url, id);
      setDebe("");
      setCuentaSeleccionada("");
      setHaber("");
    }
    await ActualizarDetalle(numero);
  };

  //Metodo ModificarDatos

  const ModificarDatos = async (url) => {
    setLoading(true);
    setIsLoading(true);
    setIsLoadingDetalle(true);
    setError(null);
    setResultadoComprobante("");
    setResultadoDetalle("");

    console.log(url);
    let param = {};
    if (url === urlcomprobante) {
      if (numero && numero !== 0) {
        param.numero = numero;
      }
      if (fecha) {
        let fechanueva = new Date(fecha).toISOString().split("T")[0];
        setFecha(fechanueva);
        param.fecha = fecha;
      }
      if (observaciones) {
        param.observaciones = observaciones;
      }
      // Validar que al menos uno de los parámetros fue proporcionado
      if (Object.keys(param).length === 0) {
        setLoading(false);
        setError("Debe ingresar los parámetros para modificar.");
        return;
      }

      try {
        // Realizamos la solicitud PUT para modificar los datos
        console.log("Modificando con parámetros:", {
          param,
        });
        const result = await ModificarComprobante(url, param);
        if (result && result.success) {
          // Si la modificación fue exitosa
          console.log("Datos modificados exitosamente.");
          setResultadoComprobante("Datos modificados con éxito.");
          setDataComprobante(result.data); // Muestra los datos modificados
        } else {
          // Si hubo un error durante la actualización
          console.log(result?.message || "Error al modificar los datos.");
          setResultadoComprobante(result?.message || "Error desconocido.");
          setError(null);
        }
      } catch (error) {
        console.log("Error en la modificación:", error);
        setError("Ocurrió un error al intentar modificar los datos.");
      }
      setNumero(GenerarCodigo());
      setFecha("");
      setObservaciones("");
      ActualizarDatos();
    } else if (url === urldetalle) {
      if (codigo && codigo !== 0) {
        param.codigo = codigo;
      }
      if (numero && numero !== 0) {
        param.numero = numero;
      }
      if (cuentaSeleccionada) {
        param.cuenta = cuentaSeleccionada;
      }
      if (debe && debe !== "") {
        param.debe = debe;
      }
      if (haber && haber !== "") {
        param.haber = haber;
      }
      // Validar que al menos uno de los parámetros fue proporcionado
      if (Object.keys(param).length === 0) {
        setLoading(false);
        setError("Debe ingresar los parámetros para modificar.");
        return;
      }

      try {
        // Realizamos la solicitud PUT para modificar los datos
        const result = await ModificarBase(url, param);
        console.log("Modificando detalles con parámetros:", {
          param,
        });
        if (result && result.success) {
          // Si la modificación fue exitosa
          console.log("Datos modificados exitosamente.");
          setResultadoDetalle("Datos modificados con éxito.");
          setDataDetalle(result.data); // Muestra los datos modificados
        } else {
          // Si hubo un error durante la actualización
          console.log(result?.message || "Error al modificar los datos.");
          setResultadoDetalle(result?.message || "Error desconocido.");
          setError(null);
        }
      } catch (error) {
        console.log("Error en la modificación:", error);
        setError("Ocurrió un error al intentar modificar los datos.");
      }
      setDebe("");
      setCuentaSeleccionada("");
      setHaber("");
      ActualizarDetalle(numero);
    }
    setLoading(false);
    setIsLoading(false);
    setIsLoadingDetalle(false);
  };

  //Metodo Agregar Detalle
  const AgregarDetalle = async () => {
    setError("");
    setResultadoDetalle("");
    setIsLoadingDetalle(true);
    setIsLoading(true);
    const resul = await ObtenerDatosPorId(urlcomprobante, numero);
    if (resul.success) {
      if (!debe || !cuentaSeleccionada || !haber) {
        console.log("debe llenar los campos");
        setError("Debe llenar los campos de Detalle");
        setIsLoadingDetalle(false);
        return;
      } else if (debe !== haber) {
        console.log("asiento descuadrado");
        setError("No puede guardar asientos descuadrados");
        setIsLoadingDetalle(false);
        return;
      }
      const data = { numero, cuenta: cuentaSeleccionada, debe, haber };

      try {
        const result = await Insertar("POST", urldetalle, data);
        if (result.success) {
          console.log(result.message);
          setDebe("");
          setHaber("");
        } else {
          console.error(result.message, result.error);
          setError(result.message || "Hubo un error al guardar los datos.");
        }
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        setError("Hubo un problema al intentar guardar los datos.");
      } finally {
        setIsLoading(false); // Volver a habilitar el botón después de la solicitud
        setIsLoadingDetalle(false);
      }
      ActualizarDetalle(numero);
    } else {
      await Guardar();
      if (!debe || !cuentaSeleccionada || !haber) {
        console.log("debe llenar los campos");
        setError("Debe llenar los campos de Detalle");
        return;
      } else if (debe !== haber) {
        console.log("asiento descuadrado");
        setError("No puede guardar asientos descuadrados");
        setIsLoadingDetalle(false);
        return;
      }
      setIsLoading(true);
      const data = { debe, cuenta: cuentaSeleccionada, haber };

      try {
        const result = await Insertar("POST", urldetalle, data);
        if (result.success) {
          console.log(result.message);
          setDebe("");
          setHaber("");
        } else {
          console.error(result.message, result.error);
          setError(result.message || "Hubo un error al guardar los datos.");
        }
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        setError("Hubo un problema al intentar guardar los datos.");
      } finally {
        setIsLoading(false); // Volver a habilitar el botón después de la solicitud
        setIsLoadingDetalle(false);
        setLoading(false);
      }
      ActualizarDetalle(numero);
    }
  };

  //Actualizar Detalle
  const ActualizarDetalle = async (numero) => {
    console.log("Obtenr datos con" + numero);
    try {
      const consult = await ObtenerDatosPorId(urlcomprobante, numero);
      if (!consult.success) {
        console.log(consult.message);
        console.log(consult.error);
        setDataDetalle([]);
        return;
      } else {
        const result = await ObtenerDatosPorId(urldetalle, numero);
        if (!result.success) {
          console.log(result.message);
          console.log(result.error);
          return;
        }
        setDataDetalle(result.data);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setError("Ocurrió un error al obtener los datos.");
    } finally {
      // Detener los estados de carga, sin importar si hubo éxito o error
      setLoading(false);
      setIsLoading(false);
      setIsLoadingDetalle(false);
    }
    setDebe("");
    setCuentaSeleccionada("");
    setHaber("");
  };

  //actualiozar datos
  const ActualizarDatos = async () => {
    if (Object.keys(busqueda).length === 0) {
      setDataComprobante([]);
      return;
    }
    try {
      // Llamar a la función de búsqueda con los parámetros
      const result = await BuscarBase(urlcomprobante, busqueda);

      console.log("Resultado de la búsqueda:", result);
      // Aquí podrías manejar los resultados de la búsqueda, si es necesario
      if (result && result.success) {
        console.log("Resultados de la búsqueda:", result.data);
        setDataComprobante(result.data);
        setBusqueda(busqueda);
      } else {
        console.log(result.message || "No se encontraron resultados.");
        setResultadoComprobante("");
        setBusqueda([]);
        setDataComprobante([]);
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

  //metodo editar
  const editar = (codigo, value1, value2, value3) => {
    if (!codigo || codigo === "") {
      console.log("Editar código:", codigo);
      console.log("Editar numero:", value2);
      // Implementar la lógica de edición aquí
      setNumero(value1);
      setFecha(value2);
      setObservaciones(value3);
      console.log(numero);
    } else if (codigo < 0 || codigo !== 0) {
      console.log("Editar código:", codigo);
      console.log("Editar numero:", numero);
      // Implementar la lógica de edición aquí
      setCodigo(codigo);
      setDebe(value1);
      setCuentaSeleccionada(value2);
      setHaber(value3);
    }
  };

  //metodo buscar
  const Buscar = async (url) => {
    setBusqueda([]);
    setDataComprobante([]);
    setDataDetalle([]);
    // Iniciar estados de carga y limpiar cualquier error previo
    setLoading(true);
    setIsLoading(true);
    setError(null);
    setResultadoComprobante("");
    setResultadoDetalle("");

    let params = {};

    if (url === urlcomprobante) {
      // Llenar 'params' solo con los valores proporcionados
      if (numero && numero !== "0") {
        params.numero = numero;
      }

      if (fecha) {
        params.fecha = fecha;
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
        numero,
        fecha,
      });
      try {
        // Llamar a la función de búsqueda con los parámetros
        const result = await BuscarBase(url, params);
        // Aquí podrías manejar los resultados de la búsqueda, si es necesario
        if (result && result.success) {
          console.log("Resultados de la búsqueda:", result.data);
          setDataComprobante(result.data);
          setBusqueda(params);
        } else {
          console.log(result.message || "No se encontraron resultados.");
          setResultadoComprobante(
            result.message || "No se encontraron resultados."
          );
        }
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
        setError("Ocurrió un error al realizar la búsqueda.");
      } finally {
        // Detener los estados de carga, sin importar si hubo éxito o error
        setLoading(false);
        setIsLoading(false);
      }
    } else {
      // Llenar 'params' solo con los valores proporcionados
      if (haber && haber !== "0") {
        params.haber = haber;
      }

      if (cuenta) {
        params.cuenta = cuenta;
      }

      if (debe && debe !== 0) {
        // Añadir el tipo de cuenta si se ha proporcionado
        params.debe = debe;
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
        debe,
        cuenta,
        haber,
      });
      try {
        // Llamar a la función de búsqueda con los parámetros
        const result = await BuscarBase(url, params);

        console.log("Resultado de la búsqueda:", result);
        // Aquí podrías manejar los resultados de la búsqueda, si es necesario
        if (result && result.success) {
          console.log("Resultados de la búsqueda:", result.data);
          setDataDetalle(result.data);
          setBusqueda(params);
        } else {
          console.log(result.message || "No se encontraron resultados.");
          setResultadoDetalle(
            result.message || "No se encontraron resultados."
          );
        }
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
        setError("Ocurrió un error al realizar la búsqueda.");
      } finally {
        // Detener los estados de carga, sin importar si hubo éxito o error
        setLoading(false);
        setIsLoading(false);
      }
    }
  };

  //funcion para cuenta llenada en la lista
  const fetchCuentas = async (id) => {
    setLoading(true); //iniciar el loading
    const urlCuenta = "http://localhost:5261/api/Contabilidad/cuenta";
    try {
      const response = await ObtenerDatos(urlCuenta);
      if (response.success) {
        setCuenta(response.data);
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
  useEffect(() => {
    setNumero(GenerarCodigo());
    fetchCuentas();
  }, []);

  // Ejecutar cada vez que numero cambie
  useEffect(() => {
    // Si `cuenta` tiene datos
    if (numero === "" || numero === 0) {
      setIsLoadingDetalle(true); //bloquea los detalles si numero esta vacio
    } else {
      ActualizarDetalle(numero); //Leer detalles del comprobante
      if (dataComprobante.codigo) {
        setCodigo(dataComprobante.codigo); // Solo setea `setCodigo` si `dataComprobante.codigo` tiene un valor válido
      }
    }
  }, [numero, dataComprobante.codigo]);
  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/contabilidad"
        title2="Home"
        link2="/"
      />
      <h1 className="title_comprobante">Comprobante de Contabilidad</h1>
      <div className="container_comprobante">
        <div className="cabecera_comprobante">
          <h2 className="title_cabecera">
            Cabecera Comprobante de Contabilidad
          </h2>
          <div className="table_comprobante">
            <form action="" className="comprobante_form">
              <div className="form_item">
                <label htmlFor="numero">Numero</label>
                <input
                  type="text"
                  name="numero"
                  id="numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="">Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
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
                onClick={() => EliminarTodosDatos(urlcomprobante, numero)}
                disabled={isLoading}
              />
              <input
                type="button"
                value="Modificar"
                onClick={() => {
                  ModificarDatos(urlcomprobante);
                }}
                disabled={isLoading}
              />
              <input
                type="button"
                value="Buscar"
                onClick={() => {
                  Buscar(urlcomprobante);
                }}
                disabled={isLoading}
              />
            </form>
            <div className="comprobante_detalle">
              {/* Mostramos el loading mientras se buscan los datos */}
              {loading && <p>Loading...</p>}

              {/* Mostramos el error si existe */}
              {error && <p>Error: {error}</p>}

              {/* Mostramos la tabla solo si hay datos */}
              {Array.isArray(dataComprobante) && dataComprobante.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Numero</th>
                      <th>Fecha</th>
                      <th>Observaciones</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataComprobante.map((item, index) => (
                      <tr key={index}>
                        <td>{item.numero}</td>
                        <td>
                          {new Date(item.fecha).toISOString().split("T")[0]}
                        </td>
                        <td>{item.observaciones}</td>
                        <td>
                          {/* Botones para editar y eliminar */}
                          <button
                            onClick={() =>
                              editar(
                                codigo,
                                item.numero,
                                new Date(item.fecha)
                                  .toISOString()
                                  .split("T")[0],
                                item.observaciones
                              )
                            }
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              EliminarDatosBoton(urlcomprobante, item.numero)
                            }
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Mostrar un mensaje si no hay datos
                resultadoComprobante && <p>{resultadoComprobante}</p>
              )}
            </div>
          </div>
        </div>
        <div className="cabecera_detalle">
          <h2 className="title_cabecera">
            Detalle Comprobante de Contabilidad
          </h2>
          <form action="" className="detalle_comprobante">
            <div className="form_input">
              <div className="form_item">
                <label htmlFor="debe">Debe</label>
                <input
                  type="text"
                  name="debe"
                  id="debe"
                  value={debe}
                  onChange={(e) => setDebe(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="cuenta">Cuenta</label>
                {cuenta.length > 0 ? (
                  <select
                    name="cuenta"
                    id="cuenta"
                    onChange={(e) => setCuentaSeleccionada(e.target.value)}
                    value={cuentaSeleccionada}
                  >
                    <option key="00000" value="">
                      Todos
                    </option>
                    {cuenta.map((tipo) => (
                      <option
                        id={tipo.codigo}
                        key={tipo.codigo}
                        value={tipo.nombre}
                      >
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select name="cuenta" id="cuenta">
                    <option key="0001" value="Vacio">
                      No Hay datos
                    </option>
                  </select>
                )}
              </div>
              <div className="form_item">
                <label htmlFor="haber">Haber</label>
                <input
                  type="text"
                  name="haber"
                  id="haber"
                  value={haber}
                  onChange={(e) => setHaber(e.target.value)}
                />
              </div>
            </div>
            <div className="form_button">
              <input
                type="button"
                value="Insertar"
                onClick={AgregarDetalle}
                disabled={isLoadingDetalle}
              />
              <input
                type="button"
                value="Eliminar Todos"
                onClick={() => {
                  EliminarTodosDatos(urldetalle, codigo);
                }}
                disabled={isLoadingDetalle}
              />
              <input
                type="button"
                value="Modificar"
                onClick={() => {
                  ModificarDatos(urldetalle);
                }}
                disabled={isLoadingDetalle}
              />
              <input
                type="button"
                value="Buscar"
                onClick={() => {
                  Buscar(urldetalle);
                }}
                disabled={isLoadingDetalle}
              />
            </div>
          </form>
          <div className="detalle_detalle">
            {/* Mostramos el loading mientras se buscan los datos */}
            {loading && <p>Loading...</p>}

            {/* Mostramos el error si existe */}
            {error && <p>Error: {error}</p>}

            {/* Mostramos la tabla solo si hay datos */}
            {Array.isArray(dataDetalle) && dataDetalle.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Debe</th>
                    <th>Cuenta</th>
                    <th>Haber</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDetalle.map((item, index) => (
                    <tr key={index}>
                      <td>{item.debe}</td>
                      <td>{item.cuenta}</td>
                      <td>{item.haber}</td>
                      <td>
                        {/* Botones para editar y eliminar */}
                        <button
                          onClick={() =>
                            editar(
                              item.codigo,
                              item.debe,
                              item.cuenta,
                              item.haber
                            )
                          }
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            EliminarDatosBoton(urldetalle, item.codigo)
                          }
                        >
                          Eliminar Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Mostrar un mensaje si no hay datos
              resultadoDetalle && <p>{resultadoDetalle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
