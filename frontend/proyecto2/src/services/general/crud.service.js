import {
  Eliminar,
  ObtenerDatosPorId,
  BuscarPorParam,
} from "../general/useFetch";

//funcion eliminar Base
const EliminarBase = async (url, codigo) => {
  console.log("Eliminando datos con código:", codigo);
  try {
    const consulta = await ObtenerDatosPorId(url, codigo);
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

    const result = await Eliminar(url, codigo);
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

//Funcion Buscar Base
const BuscarBase = async (url, params = {}) => {
  try {
    // Realizar la búsqueda con los parámetros
    const result = await BuscarPorParam(url, params);

    // Manejo del resultado
    if (result.success) {
      if (result.data && result.data.length > 0) {
        // Filtrar los resultados según los parámetros proporcionados
        let filteredResults = result.data;

        // Filtrar por código si está presente
        if (params.codigo && params.codigo !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.codigo && item.codigo.toString() === params.codigo
          );
        }

        // Filtrar por nombre si está presente
        if (params.nombre && params.nombre !== "") {
          filteredResults = filteredResults.filter(
            (item) =>
              item.nombre &&
              item.nombre.toLowerCase().includes(params.nombre.toLowerCase())
          );
        }
        //filtra por numero de cuenta
        if (params.numero && params.numero !== "") {
          filteredResults = filteredResults.filter(
            (item) => item.numero && item.numero.toString() === params.numero
          );
        }
        // Filtrar por tipo de cuenta si está presente
        if (params.tipoDeCuenta && params.tipoDeCuenta !== "") {
          filteredResults = filteredResults.filter(
            (item) =>
              item.tipoDeCuenta &&
              item.tipoDeCuenta
                .toLowerCase()
                .includes(params.tipoDeCuenta.toLowerCase())
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

//modificar base

const ModificarBase = async (url, params = {}) => {
  try {
    // Asegurar que 'codigo' está presente
    if (!params.codigo) {
      throw new Error("El parámetro 'codigo' es obligatorio.");
    }

    // Construcción correcta de la URL
    const fullUrl = `${url}/${params.codigo}`;

    // Petición PUT con datos en el formato correcto
    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params), // Enviar los datos sin envolver en { params }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: "Datos modificados con éxito.",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "No se pudo modificar los datos.",
      error: error.message,
    };
  }
};

//export metodos
export { EliminarBase, BuscarBase, ModificarBase };
