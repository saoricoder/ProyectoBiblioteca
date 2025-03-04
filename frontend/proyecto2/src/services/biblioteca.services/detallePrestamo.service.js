export const getDetallePrestamos = async (numeroPrestamo) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/detalleprestamos/${numeroPrestamo}`);
    if (!response.ok) {
      throw new Error("Error al obtener los detalles del préstamo");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const postDetallePrestamo = async (detalle) => {
  try {
    const response = await fetch("http://localhost:5286/api/Biblioteca/detalleprestamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalle),
    });
    if (!response.ok) {
      throw new Error("Error al crear el detalle");
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteDetallePrestamo = async (id) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/detalleprestamos/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el detalle");
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};