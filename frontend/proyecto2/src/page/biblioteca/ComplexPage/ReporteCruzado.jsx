import React, { useState } from 'react';
import { getLibros } from '../../../services/biblioteca.services/libro.service';
import { getAutores } from '../../../services/biblioteca.services/autor.service';

const ReporteCruzado = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [reporte, setReporte] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        getLibros().then(librosResponse => {
            getAutores().then(autoresResponse => {
                const libros = librosResponse.data;
                const autores = autoresResponse.data;
                const reporteData = autores.map(autor => {
                    const librosAutor = libros.filter(libro => libro.AutorCodigo === autor.Codigo);
                    return {
                        Autor: `${autor.Nombre} ${autor.Apellido}`,
                        Libros: librosAutor.map(libro => libro.Titulo)
                    };
                });
                setReporte(reporteData);
            });
        });
    };

    return (
        <div>
            <h1>Reporte Cruzado</h1>
            <form onSubmit={handleSubmit}>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                <button type="submit">Generar Reporte</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Autor</th>
                        <th>Libros</th>
                    </tr>
                </thead>
                <tbody>
                    {reporte.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Autor}</td>
                            <td>{item.Libros.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReporteCruzado;