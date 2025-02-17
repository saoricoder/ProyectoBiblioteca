import React, { useState, useEffect } from "react";
import { getLibros, postLibro, updateLibro, deleteLibro } from "../../../services/biblioteca.services/libro.service";
import { getAutores } from "../../../services/biblioteca.services/autor.service";
import { MenuHeader } from "../../../moduls/Menu_header";
//import "../../../css/biblioteca/AutorPage.css"; // Importar estilos
export function LibroPage() {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [isbn, setIsbn] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autorCodigo, setAutorCodigo] = useState("");
  const [valorPrestamo, setValorPrestamo] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para generar un ISBN automáticamente
  const GenerarISBN = () => {
    let isbnGenerado = Math.floor(Math.random() * 9000000) + 1000000;
    return isbnGenerado.toString();
  };

  // Cargar libros y autores al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultLibros = await getLibros();
        if (resultLibros.success) {
          setLibros(resultLibros.data);
        } else {
          setError(resultLibros.message);
        }

        const resultAutores = await getAutores();
        if (resultAutores.success) {
          setAutores(resultAutores.data);
        } else {
          setError(resultAutores.message);
        }
      } catch (error) {
        setError("Error al cargar los datos");
        console.error(error);
      }
    };

    cargarDatos();
    setIsbn(GenerarISBN()); // Generar un ISBN al cargar la página
  }, []);

  // Función para insertar un libro
  const Insertar = async () => {
    if (!isbn || !titulo || !autorCodigo || !valorPrestamo) {
      setError("Debe completar todos los campos.");
      return;
    }

    setIsLoading(true);
    const libro = { ISBN: isbn, Titulo: titulo, AutorCodigo: autorCodigo, ValorPrestamo: valorPrestamo };

    try {
      const result = await postLibro(libro);
      if (result.success) {
        setLibros([...libros, result.data]);
        setIsbn(GenerarISBN()); // Generar un nuevo ISBN después de insertar
        setTitulo("");
        setAutorCodigo("");
        setValorPrestamo("");
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al insertar el libro");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar un libro
  const Eliminar = async () => {
    if (!isbn) {
      setError("Debe ingresar un ISBN válido.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteLibro(isbn);
      if (result.success) {
        const nuevosLibros = libros.filter((libro) => libro.ISBN !== isbn);
        setLibros(nuevosLibros);
        setIsbn(GenerarISBN()); // Generar un nuevo ISBN después de eliminar
        setTitulo("");
        setAutorCodigo("");
        setValorPrestamo("");
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al eliminar el libro");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para modificar un libro
  const Modificar = async () => {
    if (!isbn || !titulo || !autorCodigo || !valorPrestamo) {
      setError("Debe completar todos los campos.");
      return;
    }

    setIsLoading(true);
    const libro = { ISBN: isbn, Titulo: titulo, AutorCodigo: autorCodigo, ValorPrestamo: valorPrestamo };

    try {
      const result = await updateLibro(isbn, libro);
      if (result.success) {
        const nuevosLibros = libros.map((lib) => (lib.ISBN === isbn ? result.data : lib));
        setLibros(nuevosLibros);
        setIsbn(GenerarISBN()); // Generar un nuevo ISBN después de modificar
        setTitulo("");
        setAutorCodigo("");
        setValorPrestamo("");
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al modificar el libro");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para buscar libros
  const Buscar = async () => {
    setLoading(true);
    setError(null);

    const isbnValue = isbn || "";
    const tituloValue = titulo || "";
    const autorCodigoValue = autorCodigo || "";
    const valorPrestamoValue = valorPrestamo || "";

    try {
      const result = await getLibros();
      if (result.success) {
        const librosFiltrados = result.data.filter((libro) => {
          return (
            libro.ISBN.includes(isbnValue) &&
            libro.Titulo.toLowerCase().includes(tituloValue.toLowerCase()) &&
            libro.AutorCodigo.includes(autorCodigoValue) &&
            libro.ValorPrestamo.toString().includes(valorPrestamoValue)
          );
        });
        setResultados(librosFiltrados);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al buscar libros");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
              <MenuHeader
                title1="Atras"
                link1="/biblioteca"
                title2="Home"
                link2="/"
              />
      <h1>Libros</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
            <select
              name="autor"
              id="autor"
              value={autorCodigo}
              onChange={(e) => setAutorCodigo(e.target.value)}
            >
              <option value="">Seleccionar Autor</option>
              {autores.map((autor) => (
                <option key={autor.Codigo} value={autor.Codigo}>
                  {autor.Nombre} {autor.Apellido}
                </option>
              ))}
            </select>
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
            onClick={Insertar}
            disabled={isLoading}
          />
          <input
            type="button"
            value="Eliminar"
            onClick={Eliminar}
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
        {loading && <p>Cargando...</p>}
        {resultados.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Valor Préstamo</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((libro) => (
                <tr key={libro.ISBN}>
                  <td>{libro.ISBN}</td>
                  <td>{libro.Titulo}</td>
                  <td>{libro.Autor.Nombre} {libro.Autor.Apellido}</td>
                  <td>{libro.ValorPrestamo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay resultados para mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default LibroPage;