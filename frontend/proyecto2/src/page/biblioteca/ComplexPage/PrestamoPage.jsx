import { useState, useEffect } from "react";
/* import {
  getPrestamos,
  postPrestamo,
  updatePrestamo,
  deletePrestamo,
} from "../../../services/biblioteca.services/prestamo.service"; */

import { getLibros } from "../../../services/biblioteca.services/libro.service";
import { MenuHeader } from "../../../moduls/Menu_header";
import "../../../css/biblioteca/PrestamoPage.css";

const PrestamoPage = () => {
  const [prestamoData, setPrestamoData] = useState({
    numero: "",
    fechaPrestamo: "",
    descripcion: "",
    detalles: [],
  });
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [editando, setEditando] = useState(null);

  const [estado, setEstado] = useState({
    error: null,
    loading: false,
    resultados: [],
  });

  // Función para generar un número de préstamo automáticamente
  const GenerarNumero = (longitud = 7) => {
    return Math.floor(Math.random() * Math.pow(10, longitud))
      .toString()
      .padStart(longitud, "0");
  };

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrestamoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para obtener los préstamos
  const obtenerPrestamos = async () => {
    setEstado((prev) => ({ ...prev, loading: true }));
    try {
      /* const data = await getPrestamos();
      setPrestamos(data); */
      console.log("Prestamos obtenidos");
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al obtener préstamos" }));
    } finally {
      setEstado((prev) => ({ ...prev, loading: false }));
    }
  };

  // Función para obtener los libros disponibles
  const obtenerLibros = async () => {
    try {
      /* const data = await getLibros();
      setLibros(data); */
      console.log("Libros obtenidos");
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al obtener libros" }));
    }
  };
  const editar = (codigo, numero, fecha, observaciones) => {
    setEditando(codigo);
    setPrestamoData({
      numero,
      fecha,
      observaciones,
    });
  };

  const EliminarDatosBoton = () => {
    console.log("Eliminar datos");
  };
  // Función para crear o actualizar un préstamo
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEstado((prev) => ({ ...prev, loading: true }));

    try {
      if (editando) {
        //await updatePrestamo(editando, prestamoData);
        console.log("Prestamo actualizado");
      } else {
        //await postPrestamo(prestamoData);
        console.log("Prestamo insertado");
      }
      obtenerPrestamos();
      limpiarFormulario();
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al guardar el préstamo" }));
    } finally {
      setEstado((prev) => ({ ...prev, loading: false }));
    }
  };

  // Función para eliminar un préstamo
  const eliminarPrestamo = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este préstamo?")) {
      setEstado((prev) => ({ ...prev, loading: true }));
      try {
        /* await deletePrestamo(id);
        obtenerPrestamos(); */
        console.log("Prestamo eliminado");
        limpiarFormulario();
      } catch (error) {
        setEstado((prev) => ({
          ...prev,
          error: "Error al eliminar el préstamo",
        }));
      } finally {
        setEstado((prev) => ({ ...prev, loading: false }));
      }
    }
  };
  // Función para limpiar el formulario después de enviar
  const limpiarFormulario = () => {
    setPrestamoData({
      numero: "",
      fechaPrestamo: "",
      descripcion: "",
      detalles: [],
    });
    setEditando(null);
  };
  const handleChangeDetalle = (e, index) => {
    const { name, value } = e.target;
    setPrestamoData((prev) => {
      const detalles = [...prev.detalles];
      detalles[index] = {
        ...detalles[index],
        [name]: value,
      };
      return { ...prev, detalles };
    });
  };

  // Función para buscar préstamos
  const handleBuscar = async () => {
    setEstado((prev) => ({ ...prev, loading: true }));
    console.log("Buscando prestamos");
    setEstado((prev) => ({
      ...prev,
      loading: false,
    }));
  };
  // Efectos para cargar datos iniciales
  useEffect(() => {
    obtenerLibros();
    obtenerPrestamos();
    setPrestamoData({ numero: GenerarNumero(), detalles: [] });
  }, []);

  return (
    <div className="container">
      <MenuHeader
        title1="Atras"
        link1="/biblioteca"
        title2="Home"
        link2="/home"
      />
      <h1>Gestión de Préstamos</h1>
      <div className="container_prestamo">
        <div className="cabecera_prestamo">
          {estado.error && <p className="error">{estado.error}</p>}
          <h2 className="title_cabecera">Cabecera de Prestamo</h2>
          {/* Cabecera del préstamo */}
          <form onSubmit={manejarEnvio}>
            <div className="form_item">
              <label>Número:</label>
              <input
                type="text"
                name="numero"
                value={prestamoData.numero}
                onChange={handleChange}
                placeholder="Número de Préstamo"
              />
            </div>
            <div className="form_item">
              <label>Fecha de Préstamo:</label>
              <input
                type="date"
                name="fechaPrestamo"
                value={prestamoData.fechaPrestamo}
                onChange={handleChange}
              />
            </div>
            <div className="form_item">
              <label>Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={prestamoData.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
              />
            </div>
            {/* Botones de acción */}
            <div>
              <button type="button" onClick={manejarEnvio}>
                Insertar
              </button>
              <button type="button" onClick={eliminarPrestamo}>
                Eliminar
              </button>
              <button type="button" onClick={handleBuscar}>
                Buscar
              </button>
              <button type="button" onClick={limpiarFormulario}>
                Modificar
              </button>
            </div>
          </form>
          {/* Mostramos la tabla solo si hay datos */}
          {Array.isArray(prestamoData.detalles) &&
          prestamoData.detalles.length > 0 ? (
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
                {prestamoData.detalles.map((item, index) => (
                  <tr key={index}>
                    <td>{item.numero}</td>
                    <td>{new Date(item.fecha).toISOString().split("T")[0]}</td>
                    <td>{item.observaciones}</td>
                    <td>
                      {/* Botones para editar y eliminar */}
                      <button
                        onClick={() =>
                          editar(
                            item.numero,
                            new Date(item.fecha).toISOString().split("T")[0],
                            item.observaciones
                          )
                        }
                      >
                        Editar
                      </button>
                      <button onClick={() => EliminarDatosBoton()}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Mostrar un mensaje si no hay datos
            prestamoData.resultados && <p>{prestamoData.resultados}</p>
          )}
        </div>
        {/* Detalles del préstamo */}
        <div className="cabecera_detalle">
          <h2 className="title_cabecera">Detalles de Préstamo </h2>
          <form className="detalle_prestamo">
            <div className="form_input">
              <div className="form_item">
                <label htmlFor="codigoLibro">Codigo Libro ISBN</label>
                <select
                  name="codigoLibro"
                  value={prestamoData.codigoLibro}
                  onChange={handleChangeDetalle}
                >
                  <option value="">Seleccionar Libro</option>
                  {libros.map((libro) => (
                    <option key={libro.codigo} value={libro.codigo}>
                      {libro.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form_item">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={prestamoData.cantidad}
                  onChange={handleChangeDetalle}
                />
              </div>
              <div className="form_item">
                <label htmlFor="fechaEntrega">Fecha de Entrega</label>
                <input
                  type="date"
                  name="fechaEntrega"
                  value={prestamoData.fechaEntrega}
                  onChange={handleChangeDetalle}
                />
              </div>
            </div>
          </form>
          {/* Botones de acción */}
          <div>
            <button type="button" onClick={manejarEnvio}>
              Insertar
            </button>
            <button type="button" onClick={eliminarPrestamo}>
              Eliminar
            </button>
            <button type="button" onClick={handleBuscar}>
              Buscar
            </button>
            <button type="button" onClick={limpiarFormulario}>
              Modificar
            </button>
          </div>
          {/* Resultados de la búsqueda */}
          <div className="detalle_detalle">
            {/* Mostramos el loading mientras se buscan los datos */}
            {estado.loading && <p>Loading...</p>}

            {/* Mostramos el error si existe */}
            {estado.error && <p>Error: {estado.error}</p>}

            {/* Mostramos la tabla solo si hay datos */}
            {Array.isArray(prestamos) && prestamos.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Codigo de Libro(ISBN)</th>
                    <th>Cantidad</th>
                    <th>Fecha de Entrega</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamos.map((item, index) => (
                    <tr key={index}>
                      <td>{item.codigoLibro}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.fechaEntrega}</td>
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
                        <button onClick={() => EliminarDatosBoton()}>
                          Eliminar Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Mostrar un mensaje si no hay datos
              prestamoData.resultados && <p>{prestamoData.resultados}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestamoPage;
