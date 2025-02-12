import React, { useState, useEffect } from 'react';
import { getLibros, postLibro ,updateLibro,deleteLibro} from '../../../services/biblioteca.services/libro.service';
import { getAutores } from '../../../services/biblioteca.services/autor.service';

const LibroPage = () => {
    const [libros, setLibros] = useState([]);
    const [autores, setAutores] = useState([]);
    const [isbn, setIsbn] = useState('');
    const [titulo, setTitulo] = useState('');
    const [autorCodigo, setAutorCodigo] = useState('');
    const [valorPrestamo, setValorPrestamo] = useState('');
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        cargarLibros();
        getAutores().then(response => setAutores(response.data));
    }, []);

    const cargarLibros = () => {
        getLibros().then(response => setLibros(response.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const libro = { ISBN: isbn, Titulo: titulo, AutorCodigo: autorCodigo, ValorPrestamo: valorPrestamo };
        if (editando) {
            updateLibro(editando, libro).then(() => {
                cargarLibros();
                setEditando(null);
            });
        } else {
            postLibro(libro).then(() => cargarLibros());
        }
        setIsbn('');
        setTitulo('');
        setAutorCodigo('');
        setValorPrestamo('');
    };

    const handleEditar = (libro) => {
        setIsbn(libro.ISBN);
        setTitulo(libro.Titulo);
        setAutorCodigo(libro.AutorCodigo);
        setValorPrestamo(libro.ValorPrestamo);
        setEditando(libro.ISBN);
    };

    const handleEliminar = (isbn) => {
        deleteLibro(isbn).then(() => cargarLibros());
    };

    return (
        <div>
            <h1>Libros</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                <select value={autorCodigo} onChange={(e) => setAutorCodigo(e.target.value)}>
                    <option value="">Seleccionar Autor</option>
                    {autores.map(autor => (
                        <option key={autor.Codigo} value={autor.Codigo}>{autor.Nombre} {autor.Apellido}</option>
                    ))}
                </select>
                <input type="number" placeholder="Valor Préstamo" value={valorPrestamo} onChange={(e) => setValorPrestamo(e.target.value)} />
                <button type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
            </form>
            <ul>
                {libros.map(libro => (
                    <li key={libro.ISBN}>
                        {libro.Titulo} - {libro.Autor.Nombre} {libro.Autor.Apellido}
                        <button onClick={() => handleEditar(libro)}>Editar</button>
                        <button onClick={() => handleEliminar(libro.ISBN)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LibroPage;