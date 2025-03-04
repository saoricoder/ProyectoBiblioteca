// autor.service.js

export const getAutores = async () => {
  try {
    const response = await fetch("http://localhost:5286/api/Biblioteca/autores");
    if (!response.ok) {
      throw new Error("Error al obtener los autores");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en getAutores:", error);
    return { success: false, message: error.message };
  }
};

export const postAutor = async (autor) => {
  try {
    const response = await fetch("http://localhost:5286/api/Biblioteca/autores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(autor),
    });
    if (!response.ok) {
      throw new Error("Error al crear el autor");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en postAutor:", error);
    return { success: false, message: error.message };
  }
};

export const deleteAutor = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/autores/${codigo}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el autor");
    }
    return { success: true, message: "Autor eliminado correctamente" };
  } catch (error) {
    console.error("Error en deleteAutor:", error);
    return { success: false, message: error.message };
  }
};

export const updateAutor = async (codigo, autor) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/autores/${codigo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(autor),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el autor");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en updateAutor:", error);
    return { success: false, message: error.message };
  }
};

export const buscarAutor = async (codigo, nombre) => {
  try {
    let url = "http://localhost:5286/api/Biblioteca/autores/buscar?";
    if (codigo) url += `codigo=${codigo}&`;
    if (nombre) url += `nombre=${encodeURIComponent(nombre)}&`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al buscar autores");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en buscarAutor:", error);
    return { success: false, message: error.message };
  }
};