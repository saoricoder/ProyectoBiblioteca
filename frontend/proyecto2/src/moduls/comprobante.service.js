import {
  BuscarPorParam,
  Eliminar,
  ObtenerDatosPorId,
} from "../moduls/useFetch";

const BuscarBase = async (url, params = {}) => {
  try {
    // Realizar la búsqueda con los parámetros
    const result = await BuscarPorParam(url, params);

    // Manejo del resultado
    if (result.success) {
      if (result.data && result.data.length > 0) {
        // Filtrar los resultados según los parámetros proporcionados
        let filteredResults = result.data;

        // Filtrar por numero si está presente
        if (params.numero && params.numero !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.numero && item.numero.toString() === params.numero
          );
        }
        // Filtrar por debe si está presente
        if (params.debe && params.debe !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.debe && item.debe.toString() === params.debe
          );
        }
        // Filtrar por haber si está presente
        if (params.haber && params.haber !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.haber && item.haber.toString() === params.haber
          );
        }
        // Filtrar por fecha si está presente
        if (params.fecha && params.fecha !== "") {
          filteredResults = filteredResults.filter(
            (item) =>
              item.fecha &&
              item.fecha.toLowerCase().includes(params.fecha.toLowerCase())
          );
        }

        // Filtrar por tipo de cuenta si está presente
        if (params.cuenta && params.cuenta !== "") {
          filteredResults = filteredResults.filter(
            (item) =>
              item.cuenta &&
              item.cuenta.toLowerCase().includes(params.cuenta.toLowerCase())
          );
        }

        // Si se encontraron resultados filtrados
        if (filteredResults.length > 0) {
          console.log(
            "Resultado encontrado con los parámetros dados:",
            filteredResults
          );
          return {
            success: true,
            message: "Datos obtenidos con éxito.",
            data: filteredResults, // Mostrar los resultados filtrados
          };
        } else {
          console.log(
            "No se encontró un resultado que coincida con los parámetros."
          );
          return "No se encontró un resultado que coincida con los parámetros.";
        }
      } else {
        // Si no hay datos en la respuesta
        console.log(
          "No se encontraron resultados para los parámetros proporcionados."
        );
        return "No se encontraron resultados para los parámetros proporcionados.";
      }
    } else {
      // Si la respuesta es exitosa pero no contiene datos
      console.log(result.message || "No se encontraron RESULTADOS.");
      return result.message || "No se encontraron resultados.";
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return "Ocurrió un error al realizar la búsqueda.";
  }
};

const EliminarRegistro = async (url, codigo) => {
  console.log("Eliminando datos con código:", codigo);
  const fullUrl = `${url}/obtener`;
  const urlFull = `${url}/eliminar`;
  try {
    const consulta = await ObtenerDatosPorId(fullUrl, codigo);
    if (!consulta.success) {
      console.log(consulta.message);
      console.log(consulta.error);
      return;
    }

    if (consulta.data && consulta.data.length === 0) {
      console.log("No se encontraron datos");
      return;
    } else {
      console.log("Datos encontrados:", consulta.data);
    }

    const result = await Eliminar(urlFull, codigo);
    if (result.success) {
      console.log(result.message);
    } else {
      console.log(result.message);
      console.log(result.error);
      return;
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return;
  }
};

const ModificarComprobante = async (url, params = {}) => {
  try {
    // Verificar que 'numero' esté presente
    if (!params.numero) {
      throw new Error("El parámetro 'numero' es obligatorio.");
    }

    // Construcción correcta de la URL (evitando `undefined`)
    const fullUrl = `${url}/${params.numero}`;
    console.log("📡 Enviando petición PUT a:", fullUrl);
    console.log("📦 Datos enviados:", params);

    // Realizar la petición PUT
    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    // Si la respuesta no es exitosa, capturar el mensaje de error del servidor
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${errorData.message || response.statusText}`
      );
    }

    const result = await response.json();
    console.log("✅ Respuesta exitosa:", result);

    return {
      success: true,
      message: "Datos modificados con éxito.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error al modificar:", error.message);

    return {
      success: false,
      message: "No se pudo modificar los datos.",
      error: error.message,
    };
  }
};

export { BuscarBase, EliminarRegistro, ModificarComprobante };
