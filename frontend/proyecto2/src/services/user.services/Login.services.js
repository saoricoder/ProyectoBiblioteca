// Función genérica para peticiones API
const apiRequest = async (url, method, body = null, customHeaders = {}) => {
  try {
    // Configuración inicial de headers y opciones de la petición
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders, // Headers personalizados, como tokens
    };

    const options = {
      method,
      headers,
      credentials: "include", // IMPORTANTE: Envía cookies HttpOnly automáticamente
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    // Realizar la petición
    const response = await fetch(url, options);

    // Verificación del tipo de contenido
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const result = isJson ? await response.json() : null;

    // Verificación de errores HTTP
    if (!response.ok) {
      // Extraer mensaje detallado del backend si existe
      const errorMessage =
        result?.title ||
        result?.message ||
        result?.errors?.[Object.keys(result.errors)[0]]?.[0] ||
        `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Retorno exitoso
    return {
      success: true,
      message: `Operación exitosa.`,
      data: result,
    };
  } catch (error) {
    // Manejo del error con mensaje detallado
    console.error("Error en apiRequest:", error.message);
    return {
      success: false,
      message: `Ocurrió un error.`,
      error: error.message,
    };
  }
};

// Función para renovar el token
const renovarToken = async () => {
  try {
    const fullUrl = `${process.env.REACT_APP_API_URL}Auth_controllers/refreshToken`;
    const response = await fetch(fullUrl, {
      method: "POST",
      credentials: "include", // Necesario para enviar la cookie HttpOnly
    });

    if (response.ok) {
      console.log("Token renovado exitosamente");
      return true;
    } else {
      console.warn("No se pudo renovar el token");
      return false;
    }
  } catch (error) {
    console.error("Error al renovar el token:", error);
    return false;
  }
};

const fetchWithAuth = async (url, method, body = null, customHeaders = {}) => {
  try {
    // Realizar la solicitud con los encabezados de autenticación
    const response = await apiRequest(url, method, body, customHeaders);

    // Verificar si la respuesta es exitosa
    if (response.ok) {
      return response; // Retorna la respuesta si fue exitosa
    }

    // Si la respuesta no es exitosa y el código de estado es 401 (no autorizado), intentar renovar el token
    if (response.status === 401) {
      console.warn("Token expirado. Intentando renovar...");

      const tokenRenovado = await renovarToken();
      if (tokenRenovado) {
        // Si el token fue renovado, repetir la solicitud original con el nuevo token
        const newResponse = await apiRequest(url, method, body, customHeaders);
        return newResponse; // Retorna la nueva respuesta después de renovar el token
      } else {
        console.error("No se pudo renovar el token. Redirigiendo al login.");
        // Redirigir al login o realizar otra acción según tu flujo de autenticación
        window.location.href = "/login"; // Ejemplo de redirección
      }
    }

    // Si la respuesta no es 401 o no está bien formada, retornamos la respuesta original
    return response;
  } catch (error) {
    // Si hubo algún error en la solicitud o en la renovación del token, manejar el error
    console.error("Error en la solicitud con autenticación:", error);
    throw new Error("Error de autenticación. Intenta nuevamente.");
  }
};

// Función de Login
const Login = async (user) => {
  const fullUrl = `${process.env.REACT_APP_API_URL}Auth_controllers/login`;
  return await apiRequest(fullUrl, "POST", user);
};

// Función de Registro
const Register = async (user) => {
  const fullUrl = `${process.env.REACT_APP_API_URL}Auth_controllers/registro`;
  return await apiRequest(fullUrl, "POST", user);
};

// Función de Logout
const Logout = async () => {
  const fullUrl = `${process.env.REACT_APP_API_URL}Auth_controllers/logout`;
  return await apiRequest(fullUrl, "POST");
};

export { Login, Register, Logout, fetchWithAuth };
