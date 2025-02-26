import { useState, useEffect } from "react";
import { fetchWithAuth } from "../services/user.services/Login.services";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      setLoading(true); // Asumiendo que tienes un estado de loading

      try {
        const fullUrl = `${process.env.REACT_APP_API_URL}Auth_controllers/verificarSesion`;
        const response = await fetchWithAuth(fullUrl, "GET");

        // Verifica si la respuesta es exitosa
        if (response.success) {
          console.log("Session activa", response.data);
          // Si todo está bien, la sesión está activa
          setIsAuthenticated(true);
        } else {
          // Si el servidor devuelve un error, actualizar el estado de autenticación
          setIsAuthenticated(false);
          console.error("Error de autenticación: sesión no válida.");
        }
      } catch (error) {
        // Captura cualquier error de la red o de la solicitud
        console.error("Error al verificar sesión:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Finaliza el loading después de la solicitud
      }
    };

    verificarSesion();
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
