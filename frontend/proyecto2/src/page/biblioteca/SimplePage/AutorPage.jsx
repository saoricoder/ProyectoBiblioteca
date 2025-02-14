import React, { useState, useEffect } from "react";
import {
  getAutores,
  postAutor,
  updateAutor,
  deleteAutor,
} from "../../../services/biblioteca.services/autor.service";

const AutorPage = () => {
  const [autores, setAutores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarAutores();
  }, []);

  const cargarAutores = () => {
    console.log("cargar autores");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      updateAutor(editando, { nombre, apellido }).then(() => {
        cargarAutores();
        setEditando(null);
      });
    } else {
      postAutor({ nombre, apellido }).then(() => cargarAutores());
    }
    setNombre("");
    setApellido("");
  };

  const handleEditar = (autor) => {
    setNombre(autor.nombre);
    setApellido(autor.apellido);
    setEditando(autor.Codigo);
  };

  const handleEliminar = (codigo) => {
    deleteAutor(codigo).then(() => cargarAutores());
  };

  return (
    <div>
      <h1>Autores</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <button type="submit">{editando ? "Actualizar" : "Crear"}</button>
      </form>
      <ul>
        {autores.map((autor) => (
          <li key={autor.Codigo}>
            {autor.Nombre} {autor.Apellido}
            <button onClick={() => handleEditar(autor)}>Editar</button>
            <button onClick={() => handleEliminar(autor.Codigo)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutorPage;
