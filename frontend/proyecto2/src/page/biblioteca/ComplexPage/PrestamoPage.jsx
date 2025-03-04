import { useState, useEffect } from "react";
import {
  getPrestamos,
  postPrestamo,
  updatePrestamo,
  deletePrestamo,
} from "../../../services/biblioteca.services/prestamo.service";
import { ObtenerDatos } from "../../../services/general/useFetch"; // Importar ObtenerDatos
import { MenuHeader } from "../../../moduls/Menu_header";
import "../../../css/biblioteca/PrestamoPage.css";
import HelpChat from "../../../moduls/chatHub";

const PrestamoPage = () => {
  const [prestamoData, setPrestamoData] = useState({
    numero: "",
    fechaPrestamo: "",
    descripcion: "",
    detalles: [],
  });
  const [libros, setLibros] = useState([]); // Estado para almacenar los libros
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
      const { success, data } = await getPrestamos();
      if (success) {
        setPrestamos(data);
      } else {
        setEstado((prev) => ({ ...prev, error: "Error al obtener préstamos" }));
      }
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al obtener préstamos" }));
    } finally {
      setEstado((prev) => ({ ...prev, loading: false }));
    }
  };

  // Función para obtener los libros disponibles
  const obtenerLibros = async () => {
    setEstado((prev) => ({ ...prev, loading: true }));
    try {
      const urlLibros = "http://localhost:5286/api/Biblioteca/libros"; // URL de la API de libros
      const { success, data } = await ObtenerDatos(urlLibros); // Usar ObtenerDatos
      if (success) {
        setLibros(data); // Actualizar el estado con los libros obtenidos
      } else {
        setEstado((prev) => ({ ...prev, error: "Error al obtener libros" }));
      }
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al obtener libros" }));
    } finally {
      setEstado((prev) => ({ ...prev, loading: false }));
    }
  };

  const editar = (codigo, numero, fecha, observaciones) => {
    setEditando(codigo);
    setPrestamoData({
      numero,
      fechaPrestamo: fecha,
      descripcion: observaciones,
      detalles: [],
    });
  };

  const EliminarDatosBoton = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este préstamo?")) {
      setEstado((prev) => ({ ...prev, loading: true }));
      try {
        const { success } = await deletePrestamo(id);
        if (success) {
          obtenerPrestamos();
          limpiarFormulario();
        } else {
          setEstado((prev) => ({ ...prev, error: "Error al eliminar el préstamo" }));
        }
      } catch (error) {
        setEstado((prev) => ({ ...prev, error: "Error al eliminar el préstamo" }));
      } finally {
        setEstado((prev) => ({ ...prev, loading: false }));
      }
    }
  };

  // Función para crear o actualizar un préstamo
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEstado((prev) => ({ ...prev, loading: true }));

    try {
      if (editando) {
        const { success } = await updatePrestamo(editando, prestamoData);
        if (success) {
          console.log("Préstamo actualizado");
          obtenerPrestamos();
          limpiarFormulario();
        } else {
          setEstado((prev) => ({ ...prev, error: "Error al actualizar el préstamo" }));
        }
      } else {
        const { success } = await postPrestamo(prestamoData);
        if (success) {
          console.log("Préstamo insertado");
          obtenerPrestamos();
          limpiarFormulario();
        } else {
          setEstado((prev) => ({ ...prev, error: "Error al insertar el préstamo" }));
        }
      }
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al guardar el préstamo" }));
    } finally {
      setEstado((prev) => ({ ...prev, loading: false }));
    }
  };

  // Función para limpiar el formulario después de enviar
  const limpiarFormulario = () => {
    setPrestamoData({
      numero: GenerarNumero(),
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
    try {
      const { success, data } = await getPrestamos();
      if (success) {
        setPrestamos(data);
      } else {
        setEstado((prev) => ({ ...prev, error: "Error al buscar préstamos" }));
      }
    } catch (error) {
      setEstado((prev) => ({ ...prev, error: "Error al buscar préstamos" }));
    } finally {
      setEstado((prev) => ({ ...prev, loading: false }));
    }
  };

  // Efectos para cargar datos iniciales
  useEffect(() => {
    obtenerLibros(); // Obtener los libros al cargar la página
    obtenerPrestamos();
    setPrestamoData((prev) => ({ ...prev, numero: GenerarNumero() }));
  }, []);

  // Update the MenuHeader component near the return statement
  return (
    <div className="container">
      <MenuHeader
        menuItems={[
          { title: "Atrás", link: "/biblioteca" },
          { title: "Home", link: "/home" },
          { title: "Reportes", link: "/biblioteca/reportes" }
        ]}
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
              <button type="submit" disabled={estado.loading}>
                {editando ? "Actualizar" : "Insertar"}
              </button>
              <button type="button" onClick={() => EliminarDatosBoton(editando)} disabled={!editando}>
                Eliminar
              </button>
              <button type="button" onClick={handleBuscar} disabled={estado.loading}>
                Buscar
              </button>
              <button type="button" onClick={limpiarFormulario}>
                Limpiar
              </button>
            </div>
          </form>
          {/* Mostramos la tabla solo si hay datos */}
          {Array.isArray(prestamos) && prestamos.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((item, index) => (
                  <tr key={index}>
                    <td>{item.numero}</td>
                    <td>{new Date(item.fechaPrestamo).toISOString().split("T")[0]}</td>
                    <td>{item.descripcion}</td>
                    <td>
                      {/* Botones para editar y eliminar */}
                      <button
                        onClick={() =>
                          editar(
                            item.numero,
                            item.fechaPrestamo,
                            item.descripcion
                          )
                        }
                      >
                        Editar
                      </button>
                      <button onClick={() => EliminarDatosBoton(item.numero)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Mostrar un mensaje si no hay datos
            <p>No hay préstamos registrados</p>
          )}
        </div>
        {/* Detalles del préstamo */}
        <div className="cabecera_detalle">
          <h2 className="title_cabecera">Detalles de Préstamo </h2>
          <form className="detalle_prestamo">
            <div className="form_input">
              <div className="form_item">
                <label htmlFor="codigoLibro">Código Libro ISBN</label>
                <select
                  name="codigoLibro"
                  value={prestamoData.codigoLibro}
                  onChange={(e) => handleChangeDetalle(e, 0)}
                >
                  <option value="">Seleccionar Libro</option>
                  {libros.map((libro) => (
                    <option key={libro.isbn} value={libro.isbn}>
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
                  onChange={(e) => handleChangeDetalle(e, 0)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="fechaEntrega">Fecha de Entrega</label>
                <input
                  type="date"
                  name="fechaEntrega"
                  value={prestamoData.fechaEntrega}
                  onChange={(e) => handleChangeDetalle(e, 0)}
                />
              </div>
            </div>
          </form>
          {/* Botones de acción */}
          <div>
            <button type="button" onClick={manejarEnvio} disabled={estado.loading}>
              Insertar
            </button>
            <button type="button" onClick={() => EliminarDatosBoton(editando)} disabled={!editando}>
              Eliminar
            </button>
            <button type="button" onClick={handleBuscar} disabled={estado.loading}>
              Buscar
            </button>
            <button type="button" onClick={limpiarFormulario}>
              Limpiar
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
                    <th>Código de Libro (ISBN)</th>
                    <th>Cantidad</th>
                    <th>Fecha de Entrega</th>
                    <th>Acción</th>
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
                        <button onClick={() => EliminarDatosBoton(item.codigo)}>
                          Eliminar Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Mostrar un mensaje si no hay datos
              <p>No hay detalles de préstamos registrados</p>
            )}
          </div>
        </div>
      </div>
      <HelpChat />
    </div>
  );
};

export default PrestamoPage;