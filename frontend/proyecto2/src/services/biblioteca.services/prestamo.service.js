import {
  BuscarPorParam,
  Eliminar,
  ObtenerDatosPorId,
} from "../general/useFetch";
// Función para obtener todos los préstamos
export const getPrestamos = async () => {
  try {
    const response = await fetch("http://localhost:5286/api/Biblioteca/prestamos");
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
    const response = await fetch("http://localhost:5286/api/Biblioteca/prestamos", {
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
const API_BASE = "http://localhost:5286/api/Biblioteca";
// Función para actualizar un préstamo
export const updatePrestamo = async (numero, prestamo) => {
  try {
    const response = await fetch(`http://localhost:5286/api/Biblioteca/prestamos/${numero}`, {
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
    const response = await fetch(`http://localhost:5286/api/Biblioteca/prestamos/${numero}`, {
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



const BuscarBase = async (url, params = {}) => {
  try {
    const result = await BuscarPorParam(url, params);

    if (result.success) {
      if (result.data && result.data.length > 0) {
        let filteredResults = result.data;

        // Filtrar por número de préstamo
        if (params.numero && params.numero !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.numero && item.numero.toString() === params.numero
          );
        }
        // Filtrar por fecha de préstamo
        if (params.fechaPrestamo && params.fechaPrestamo !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.fechaPrestamo && item.fechaPrestamo.includes(params.fechaPrestamo)
          );
        }
        // Filtrar por descripción
        if (params.descripcion && params.descripcion !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.descripcion && item.descripcion.toLowerCase().includes(params.descripcion.toLowerCase())
          );
        }

        if (filteredResults.length > 0) {
          return {
            success: true,
            message: "Datos obtenidos con éxito.",
            data: filteredResults,
          };
        }
      }
    }
    return {
      success: false,
      message: "No se encontraron resultados.",
    };
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return {
      success: false,
      message: "Error al realizar la búsqueda.",
      error: error.message,
    };
  }
};

const EliminarRegistro = async (url, codigo) => {
  console.log("Eliminando préstamo:", codigo);
  const fullUrl = `${url}/obtener`;
  const urlFull = `${url}/eliminar`;

  try {
    const consulta = await ObtenerDatosPorId(fullUrl, codigo);
    if (!consulta.success) {
      return {
        success: false,
        message: consulta.message,
        error: consulta.error
      };
    }

    const result = await Eliminar(urlFull, codigo);
    return result;
  } catch (error) {
    console.error("Error al eliminar:", error);
    return {
      success: false,
      message: "Error al eliminar el registro",
      error: error.message
    };
  }
};

const ModificarPrestamo = async (url, params = {}) => {
  try {
    if (!params.numero) {
      throw new Error("El número de préstamo es requerido");
    }

    const fullUrl = `${url}/${params.numero}`;
    console.log("📡 Modificando préstamo:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al modificar el préstamo");
    }

    const result = await response.json();
    return {
      success: true,
      message: "Préstamo modificado con éxito",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      success: false,
      message: "Error al modificar el préstamo",
      error: error.message,
    };
  }
};

export { BuscarBase, EliminarRegistro, ModificarPrestamo };