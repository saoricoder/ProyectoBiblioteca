import React, { useState } from 'react';
import { getPrestamos } from '../../../services/biblioteca.services/prestamo.service';

const ReporteLibrosPorDia = () => {
    const [fecha, setFecha] = useState('');
    const [libros, setLibros] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        getPrestamos().then(response => {
            const prestamosDelDia = response.data.filter(p => p.FechaPrestamo === fecha);
            const librosDelDia = prestamosDelDia.flatMap(p => p.Detalles);
            setLibros(librosDelDia);
        });
    };

    return (
        <div>
            <h1>Reporte de Libros por Día</h1>
            <form onSubmit={handleSubmit}>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                <button type="submit">Generar Reporte</button>
            </form>
            <ul>
                {libros.map((libro, index) => (
                    <li key={index}>{libro.CodigoLibro} - {libro.Cantidad}</li>
                ))}
            </ul>
        </div>
    );
};

export default ReporteLibrosPorDia;