import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";

//Modulos Generales
import { Menu } from "./page/Menu";
import AdminChat from "./moduls/AdminChat";
import { RegisterForm } from "./page/Register";

// Módulo Contabilidad
import { IndexCont } from "./page/contabilidad/indexCont";
import { SimpleUno } from "./page/contabilidad/SimplePage/simpleUno";
import { SimpleDos } from "./page/contabilidad/SimplePage/SimpleDos";
import { ComplexUno } from "./page/contabilidad/ComplexPage/complejaUno";
import { ReporteUno } from "./page/contabilidad/ComplexPage/reporteUno";
import { ReporteDos } from "./page/contabilidad/ComplexPage/reporteDos";

// Módulo Biblioteca
import { IndexBiblio } from "./page/biblioteca/indexBiblio";
import AutorPage from "./page/biblioteca/SimplePage/AutorPage";
import LibroPage from "./page/biblioteca/SimplePage/LibroPage";
import PrestamoPage from "./page/biblioteca/ComplexPage/PrestamoPage";
import ReporteLibrosPorDia from "./page/biblioteca/ComplexPage/ReporteLibrosPorDia";
import ReporteCruzado from "./page/biblioteca/ComplexPage/ReporteCruzado";

//Modulo de Selección
import { IndexSelec } from "./page/seleccion/indexSelec";
import { SimpleUnos } from "./page/seleccion/SimplePage/simpleUnoS";
import { SimpleDoss } from "./page/seleccion/SimplePage/SimpleDosS";
import { ComplexUnos } from "./page/seleccion/ComplexPage/complejaUnoS";
import { ReporteUnos } from "./page/seleccion/ComplexPage/reporteUnoS";
import { ReporteDoss } from "./page/seleccion/ComplexPage/reporteDosS";

// Módulo Nómina
import { IndexNom } from "./page/nomina/indexNom";
import ProtectedRoute from "./components/ProtectedRoute";

// Configuración de las rutas de la aplicación
const router = createBrowserRouter([
  // Ruta principal que carga el componente App
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Menu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <App />,
  },
  {
    path: "/registro",
    element: <RegisterForm />,
  },

  // Rutas Protegidas para el módulo Principal
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminChat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Menu />
      </ProtectedRoute>
    ),
  },
  {
    path: "/nomina",
    element: (
      <ProtectedRoute>
        <IndexNom />
      </ProtectedRoute>
    ),
  },

  // Rutas Protegidas para el módulo de Selección
  {
    path: "/seleccion",
    element: (
      <ProtectedRoute>
        <IndexSelec />
      </ProtectedRoute>
    ),
  },
  {
    path: "/solicitud",
    element: (
      <ProtectedRoute>
        <SimpleUnos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/entrevista",
    element: (
      <ProtectedRoute>
        <SimpleDoss />
      </ProtectedRoute>
    ),
  },
  {
    path: "/evaluacion",
    element: (
      <ProtectedRoute>
        <ComplexUnos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ranking",
    element: (
      <ProtectedRoute>
        <ReporteUnos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cruzada",
    element: (
      <ProtectedRoute>
        <ReporteDoss />
      </ProtectedRoute>
    ),
  },

  // Rutas para el módulo de Contabilidad
  {
    path: "/contabilidad",
    element: (
      <ProtectedRoute>
        <IndexCont />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tipocuenta",
    element: (
      <ProtectedRoute>
        <SimpleUno />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cuenta",
    element: (
      <ProtectedRoute>
        <SimpleDos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/comprobante",
    element: (
      <ProtectedRoute>
        <ComplexUno />
      </ProtectedRoute>
    ),
  },
  {
    path: "/balance",
    element: (
      <ProtectedRoute>
        <ReporteUno />
      </ProtectedRoute>
    ),
  },
  {
    path: "/resultado",
    element: (
      <ProtectedRoute>
        <ReporteDos />
      </ProtectedRoute>
    ),
  },

  // Rutas Protegidas para el módulo de Biblioteca
  {
    path: "/biblioteca",
    element: (
      <ProtectedRoute>
        <IndexBiblio />
      </ProtectedRoute>
    ),
  },
  {
    path: "/biblioteca/autor",
    element: (
      <ProtectedRoute>
        <AutorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/biblioteca/libro",
    element: (
      <ProtectedRoute>
        <LibroPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/biblioteca/prestamo",
    element: (
      <ProtectedRoute>
        <PrestamoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/biblioteca/reporte-libros-por-dia",
    element: (
      <ProtectedRoute>
        <ReporteLibrosPorDia />
      </ProtectedRoute>
    ),
  },
  {
    path: "/biblioteca/reporte-cruzado",
    element: (
      <ProtectedRoute>
        <ReporteCruzado />
      </ProtectedRoute>
    ),
  },

  // Ruta Protegida para el módulo de Nómina
  {
    path: "/nomina",
    element: (
      <ProtectedRoute>
        <IndexNom />
      </ProtectedRoute>
    ),
  },
]);

// Renderizado de la aplicación en el DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
