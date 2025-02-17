import React, { useState, useEffect } from "react";
import { getPrestamos, postPrestamo, updatePrestamo, deletePrestamo } from "../../../services/biblioteca.services/prestamo.service";
import { getLibros } from "../../../services/biblioteca.services/libro.service";
import { MenuHeader } from "../../../moduls/Menu_header";
import "../../../css/biblioteca/PrestamoPage.css"; // Importar estilos
const PrestamoPage = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [numero, setNumero] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Función para generar un número de préstamo automáticamente
  const GenerarNumero = () => {
    let numeroGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return numeroGenerado.toString();
  };

  // Cargar préstamos y libros al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultPrestamos = await getPrestamos();
        if (resultPrestamos.success) {
          setPrestamos(resultPrestamos.data);
        } else {
          setError(resultPrestamos.message);
        }

        const resultLibros = await getLibros();
        if (resultLibros.success) {
          setLibros(resultLibros.data);
        } else {
          setError(resultLibros.message);
        }
      } catch (error) {
        setError("Error al cargar los datos");
        console.error(error);
      }
    };

    cargarDatos();
    setNumero(GenerarNumero()); // Generar un número de préstamo al cargar la página
  }, []);

  // Función para manejar el envío del formulario (Insertar/Modificar)
  const handleSubmit = async () => {
    if (!numero || !fechaPrestamo || !descripcion || detalles.length === 0) {
      setError("Debe completar todos los campos y agregar al menos un detalle.");
      return;
    }

    const prestamo = { Numero: numero, FechaPrestamo: fechaPrestamo, Descripcion: descripcion, Detalles: detalles };

    try {
      let result;
      if (editando) {
        result = await updatePrestamo(editando, prestamo);
      } else {
        result = await postPrestamo(prestamo);
      }

      if (result.success) {
        const resultPrestamos = await getPrestamos();
        if (resultPrestamos.success) {
          setPrestamos(resultPrestamos.data);
        }
        setEditando(null);
        setNumero(GenerarNumero()); // Generar un nuevo número de préstamo después de guardar
        setFechaPrestamo("");
        setDescripcion("");
        setDetalles([]);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al guardar el préstamo");
      console.error(error);
    }
  };

  // Función para manejar la eliminación de un préstamo
  const handleEliminar = async () => {
    if (!numero) {
      setError("Debe seleccionar un préstamo para eliminar.");
      return;
    }

    try {
      const result = await deletePrestamo(numero);
      if (result.success) {
        const resultPrestamos = await getPrestamos();
        if (resultPrestamos.success) {
          setPrestamos(resultPrestamos.data);
        }
        setNumero(GenerarNumero()); // Generar un nuevo número de préstamo después de eliminar
        setFechaPrestamo("");
        setDescripcion("");
        setDetalles([]);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al eliminar el préstamo");
      console.error(error);
    }
  };

  // Función para manejar la búsqueda de préstamos
  const handleBuscar = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPrestamos();
      if (result.success) {
        const filtrados = result.data.filter((prestamo) => {
          return (
            prestamo.Numero.includes(numero) &&
            prestamo.FechaPrestamo.includes(fechaPrestamo) &&
            prestamo.Descripcion.toLowerCase().includes(descripcion.toLowerCase())
          );
        });
        setResultados(filtrados);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al buscar préstamos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un detalle al préstamo
  const handleAddDetalle = () => {
    setDetalles([...detalles, { CodigoLibro: "", Cantidad: 0, FechaEntrega: "" }]);
  };

  // Función para manejar cambios en los detalles
  const handleDetalleChange = (index, field, value) => {
    const newDetalles = [...detalles];
    newDetalles[index][field] = value;
    setDetalles(newDetalles);
  };

  return (
    <div>
              <MenuHeader
        title1="Atras"
        link1="/biblioteca"
        title2="Home"
        link2="/home"
      />
      <h1>Préstamos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Cabecera del préstamo */}
      <div>
        <label>Número:</label>
        <input type="text" value={numero} readOnly />
      </div>
      <div>
        <label>Fecha de Préstamo:</label>
        <input type="date" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} />
      </div>
      <div>
        <label>Descripción:</label>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>

      {/* Detalles del préstamo */}
      <button type="button" onClick={handleAddDetalle}>Agregar Detalle</button>
      {detalles.map((detalle, index) => (
        <div key={index}>
          <div>
            <label>Código de Libro (ISBN):</label>
            <select value={detalle.CodigoLibro} onChange={(e) => handleDetalleChange(index, "CodigoLibro", e.target.value)}>
              <option value="">Seleccionar Libro</option>
              {libros.map((libro) => (
                <option key={libro.ISBN} value={libro.ISBN}>
                  {libro.Titulo} (ISBN: {libro.ISBN})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Cantidad:</label>
            <input type="number" value={detalle.Cantidad} onChange={(e) => handleDetalleChange(index, "Cantidad", e.target.value)} />
          </div>
          <div>
            <label>Fecha de Entrega:</label>
            <input type="date" value={detalle.FechaEntrega} onChange={(e) => handleDetalleChange(index, "FechaEntrega", e.target.value)} />
          </div>
        </div>
      ))}

      {/* Botones de acción */}
      <div>
        <button type="button" onClick={handleSubmit}>Insertar</button>
        <button type="button" onClick={handleEliminar}>Eliminar</button>
        <button type="button" onClick={handleSubmit}>Modificar</button>
        <button type="button" onClick={handleBuscar}>Buscar</button>
      </div>

      {/* Resultados de la búsqueda */}
      {loading && <p>Cargando...</p>}
      {resultados.length > 0 && (
        <div>
          <h2>Resultados de la búsqueda</h2>
          <ul>
            {resultados.map((prestamo) => (
              <li key={prestamo.Numero}>
                {prestamo.Numero} - {prestamo.FechaPrestamo} - {prestamo.Descripcion}
                <button onClick={() => setNumero(prestamo.Numero)}>Seleccionar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PrestamoPage;