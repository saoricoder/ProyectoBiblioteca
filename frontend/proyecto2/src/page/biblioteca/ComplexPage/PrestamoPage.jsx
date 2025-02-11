import React, { useState, useEffect } from 'react';
import { getPrestamos, postPrestamo,updatePrestamo,deletePrestamo } from '../../../services/biblioteca.services/prestamo.service';
import { getLibros } from '../../../services/biblioteca.services/libro.service';

const PrestamoPage = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [libros, setLibros] = useState([]);
    const [numero, setNumero] = useState('');
    const [fechaPrestamo, setFechaPrestamo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [detalles, setDetalles] = useState([]);
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        cargarPrestamos();
        getLibros().then(response => setLibros(response.data));
    }, []);

    const cargarPrestamos = () => {
        getPrestamos().then(response => setPrestamos(response.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prestamo = { Numero: numero, FechaPrestamo: fechaPrestamo, Descripcion: descripcion, Detalles: detalles };
        if (editando) {
            updatePrestamo(editando, prestamo).then(() => {
                cargarPrestamos();
                setEditando(null);
            });
        } else {
            postPrestamo(prestamo).then(() => cargarPrestamos());
        }
        setNumero('');
        setFechaPrestamo('');
        setDescripcion('');
        setDetalles([]);
    };

    const handleEditar = (prestamo) => {
        setNumero(prestamo.Numero);
        setFechaPrestamo(prestamo.FechaPrestamo);
        setDescripcion(prestamo.Descripcion);
        setDetalles(prestamo.Detalles);
        setEditando(prestamo.Numero);
    };

    const handleEliminar = (numero) => {
        deletePrestamo(numero).then(() => cargarPrestamos());
    };

    const handleAddDetalle = () => {
        setDetalles([...detalles, { CodigoLibro: '', Cantidad: 0, FechaEntrega: '' }]);
    };

    const handleDetalleChange = (index, field, value) => {
        const newDetalles = [...detalles];
        newDetalles[index][field] = value;
        setDetalles(newDetalles);
    };

    return (
        <div>
            <h1>Préstamos</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                <input type="date" placeholder="Fecha Préstamo" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} />
                <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                <button type="button" onClick={handleAddDetalle}>Agregar Detalle</button>
                {detalles.map((detalle, index) => (
                    <div key={index}>
                        <select value={detalle.CodigoLibro} onChange={(e) => handleDetalleChange(index, 'CodigoLibro', e.target.value)}>
                            <option value="">Seleccionar Libro</option>
                            {libros.map(libro => (
                                <option key={libro.ISBN} value={libro.ISBN}>{libro.Titulo}</option>
                            ))}
                        </select>
                        <input type="number" placeholder="Cantidad" value={detalle.Cantidad} onChange={(e) => handleDetalleChange(index, 'Cantidad', e.target.value)} />
                        <input type="date" placeholder="Fecha Entrega" value={detalle.FechaEntrega} onChange={(e) => handleDetalleChange(index, 'FechaEntrega', e.target.value)} />
                    </div>
                ))}
                <button type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
            </form>
            <ul>
                {prestamos.map(prestamo => (
                    <li key={prestamo.Numero}>
                        {prestamo.Numero} - {prestamo.FechaPrestamo} - {prestamo.Descripcion}
                        <button onClick={() => handleEditar(prestamo)}>Editar</button>
                        <button onClick={() => handleEliminar(prestamo.Numero)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PrestamoPage;