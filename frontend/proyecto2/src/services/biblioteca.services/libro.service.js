// libro.service.js

// Función para obtener todos los libros
export const getLibros = async () => {
  try {
    const response = await fetch("http://localhost:5286/api/Biblioteca/libros");
    if (!response.ok) {
      throw new Error("Error al obtener los libros");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en getLibros:", error);
    return { success: false, message: error.message };
  }
};

// Función para crear un nuevo libro
export const postLibro = async (libro) => {
  try {
    const response = await fetch("http://localhost:5286/api/Biblioteca/libros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(libro),
    });
    if (!response.ok) {
      throw new Error("Error al crear el libro");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en postLibro:", error);
    return { success: false, message: error.message };
  }
};

// Función para eliminar un libro por su ISBN
export const deleteLibro = async (isbn) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/libros/${isbn}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el libro");
    }
    return { success: true, message: "Libro eliminado correctamente" };
  } catch (error) {
    console.error("Error en deleteLibro:", error);
    return { success: false, message: error.message };
  }
};

// Función para actualizar un libro
export const updateLibro = async (isbn, libro) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/libros/${isbn}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(libro),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el libro");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en updateLibro:", error);
    return { success: false, message: error.message };
  }
};

// Función para buscar libros
export const buscarLibro = async (isbn, autorCodigo, titulo) => {
  try {
    let url = "http://localhost:5286/api/Biblioteca/libros/buscar?";
    if (isbn) url += `isbn=${isbn}&`;
    if (autorCodigo) url += `autorCodigo=${autorCodigo}&`;
    if (titulo) url += `titulo=${encodeURIComponent(titulo)}&`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al buscar libros");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en buscarLibro:", error);
    return { success: false, message: error.message };
  }
};

