// prestamo.service.js

// Función para obtener todos los préstamos
export const getPrestamos = async () => {
  try {
    const response = await fetch("http://localhost:7015/api/Biblioteca_controllers/prestamos");
    if (!response.ok) {
      throw new Error("Error al obtener los préstamos");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en getPrestamos:", error);
    return { success: false, message: error.message };
  }
};

// Función para crear un nuevo préstamo
export const postPrestamo = async (prestamo) => {
  try {
    const response = await fetch("http://localhost:7015/api/Biblioteca_controllers/prestamos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prestamo),
    });
    if (!response.ok) {
      throw new Error("Error al crear el préstamo");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en postPrestamo:", error);
    return { success: false, message: error.message };
  }
};

// Función para actualizar un préstamo
export const updatePrestamo = async (numero, prestamo) => {
  try {
    const response = await fetch(`http://localhost:7015/api/Biblioteca_controllers/prestamos/${numero}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prestamo),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el préstamo");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en updatePrestamo:", error);
    return { success: false, message: error.message };
  }
};

// Función para eliminar un préstamo
export const deletePrestamo = async (numero) => {
  try {
    const response = await fetch(`http://localhost:7015/api/Biblioteca_controllers/prestamos/${numero}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el préstamo");
    }
    return { success: true, message: "Préstamo eliminado correctamente" };
  } catch (error) {
    console.error("Error en deletePrestamo:", error);
    return { success: false, message: error.message };
  }
};