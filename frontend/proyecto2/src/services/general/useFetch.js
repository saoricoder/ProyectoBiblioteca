// import { useEffect, useState } from "react";

/* function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
} */
//metodo obtener datos
const ObtenerDatos = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Verificamos el tipo de contenido de la respuesta
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      return {
        success: true,
        message: "Datos obtenidos con éxito.",
        data: result,
      };
    } else {
      throw new Error("La respuesta no es de tipo JSON");
    }
  } catch (error) {
    return {
      success: false,
      message: "Hubo un error al obtener los datos.",
      error: error.message,
    };
  }
};

// metodo insertar

const Insertar = async (metodo, url, data) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(data);
  console.log(raw);
  const requestOptions = {
    method: metodo,
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    //credentials: "include", // Corregido: debe ser en minúsculas
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json(); // Procesa la respuesta como JSON
    return {
      success: true,
      message: "Datos insertados con éxito.",
      data: result, // Datos obtenidos de la API
    };
  } catch (error) {
    return {
      success: false,
      message: "Hubo un error al insertar los datos.",
      error: error.message, // Detalle del error
    };
  }
};

//metodo modificar

const Modificar = async (url, data) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: "PUT", // Método para modificar recursos
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    //credentials: "include", // Incluye cookies o credenciales
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json(); // Procesa el resultado como JSON
    return {
      success: true,
      message: "Recurso modificado con éxito.",
      data: result, // Los datos del recurso actualizado
    };
  } catch (error) {
    return {
      success: false,
      message: "Hubo un error al modificar el recurso.",
      error: error.message, // El mensaje del error para diagnóstico
    };
  }
};

//metodo eliminar
const Eliminar = async (url, id) => {
  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
    //credentials: "include", // Incluye cookies si es necesario
  };

  try {
    // Combina la URL base con el ID
    const fullUrl = `${url}/${id}`;

    const response = await fetch(fullUrl, requestOptions);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      message: `Recurso con ID ${id} eliminado con éxito.`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Hubo un error al eliminar el recurso con ID ${id}.`,
      error: error.message, // Mensaje detallado del error
    };
  }
};

//metodo buscar por cualquier parametro
const BuscarPorParam = async (url, params = {}) => {
  try {
    // Convertir el objeto params a query string
    const query = new URLSearchParams(params).toString();

    // Si hay parámetros, construir la URL completa
    const fullUrl = query ? `${url}/buscar?${query}` : `${url}/buscar`;

    // Realizar la petición GET
    const response = await fetch(fullUrl, { method: "GET" });

    // Validar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Obtener los datos como JSON
    const result = await response.json();

    return {
      success: true,
      message: `Recurso encontrado con éxito.`,
      data: result, // Datos del recurso encontrado
    };
  } catch (error) {
    return {
      success: false,
      message: `No se encontraron resultados.`,
      error: error.message, // Detalle del error
    };
  }
};

//metodo obtnener datos por id
const ObtenerDatosPorId = async (url, id) => {
  try {
    // Construir la URL completa
    const fullUrl = `${url}/${id}`;
    // Realizar la petición GET
    const response = await fetch(fullUrl, { method: "GET" });

    // Validar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Obtener los datos como JSON
    const result = await response.json();

    return {
      success: true,
      message: `Recurso con ID ${id} encontrado con éxito.`,
      data: result, // Datos del recurso encontrado
    };
  } catch (error) {
    return {
      success: false,
      message: `No se pudo encontrar el recurso con ID ${id}.`,
      error: error.message, // Detalle del error
    };
  }
};

//exportar metodos
export {
  Insertar,
  Modificar,
  Eliminar,
  BuscarPorParam,
  ObtenerDatosPorId,
  ObtenerDatos,
};
