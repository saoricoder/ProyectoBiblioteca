const Login = async (user) => {
  const { userName, password } = user;
  try {
    // Construir la URL completa
    const fullUrl = `${process.env.REACT_APP_API_URL}login`;
    // Realizar la petición POST
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    // Validar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Obtener los datos como JSON
    const result = await response.json();

    return {
      success: true,
      message: `Inicio de sesión exitoso.`,
      data: result, // Datos del recurso encontrado
    };
  } catch (error) {
    return {
      success: false,
      message: `No se pudo iniciar sesión.`,
      error: error.message, // Detalle del error
    };
  }
};

const Register = async (user) => {
  const { userName, password, Role } = user;
  try {
    // Construir la URL completa
    const fullUrl = `${process.env.REACT_APP_API_URL}register`;
    // Realizar la petición POST
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password, Role }),
    });

    // Validar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Obtener los datos como JSON
    const result = await response.json();

    return {
      success: true,
      message: `Registro exitoso.`,
      data: result, // Datos del recurso encontrado
    };
  } catch (error) {
    return {
      success: false,
      message: `No se pudo registrar.`,
      error: error.message, // Detalle del error
    };
  }
};

const Logout = async () => {
  try {
    // Construir la URL completa
    const fullUrl = `${process.env.REACT_APP_API_URL}logout`;
    // Realizar la petición POST
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    // Validar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      message: `Cierre de sesión exitoso.`,
    };
  } catch (error) {
    return {
      success: false,
      message: `No se pudo cerrar sesión.`,
      error: error.message, // Detalle del error
    };
  }
};
