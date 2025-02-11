import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";

// Módulo Contabilidad
import { IndexCont } from "./page/contabilidad/indexCont";
import { SimpleUno } from "./page/contabilidad/SimplePage/simpleUno";
import { SimpleDos } from "./page/contabilidad/SimplePage/SimpleDos";
import { ComplexUno } from "./page/contabilidad/ComplexPage/complejaUno";
import { ReporteUno } from "./page/contabilidad/ComplexPage/reporteUno";
import { ReporteDos } from "./page/contabilidad/ComplexPage/reporteDos";

// Módulo Biblioteca
import { IndexBiblio } from "./page/biblioteca/indexBiblio";
import AutorPage from './page/biblioteca/SimplePage/AutorPage';
import LibroPage from './page/biblioteca/SimplePage/LibroPage';
import PrestamoPage from './page/biblioteca/ComplexPage/PrestamoPage';
import ReporteLibrosPorDia from './page/biblioteca/ComplexPage/ReporteLibrosPorDia';
import ReporteCruzado from './page/biblioteca/ComplexPage/ReporteCruzado';

// Módulo Selección
import { IndexSelec } from "./page/seleccion/indexSelec";

// Módulo Nómina
import { IndexNom } from "./page/nomina/indexNom";

// Módulo Formulario
import { Formulario } from "./page/Formulario";

// Configuración de las rutas de la aplicación
const router = createBrowserRouter([
  // Ruta principal que carga el componente App
  {
    path: "/",
    element: <App />,
  },
  
  // Rutas para el módulo de Contabilidad
  {
    path: "/contabilidad",
    element: <IndexCont />,  // Página principal de Contabilidad
  },
  {
    path: "/tipocuenta",
    element: <SimpleUno />,  // Página para el tipo de cuenta en Contabilidad
  },
  {
    path: "/cuenta",
    element: <SimpleDos />,   // Página para la cuenta en Contabilidad
  },
  {
    path: "/comprobante",
    element: <ComplexUno />,  // Página para comprobantes en Contabilidad
  },
  {
    path: "/balance",
    element: <ReporteUno />,  // Página de reporte uno en Contabilidad
  },
  {
    path: "/resultado",
    element: <ReporteDos />,  // Página de reporte dos en Contabilidad
  },

  // Rutas para el módulo de Biblioteca
  {
    path: "/biblioteca",
    element: <IndexBiblio />, // Página principal de Biblioteca
  },
  {
    path: "/biblioteca/autor",
    element: <AutorPage />, // Página Autor de Biblioteca
  },
  {
    path: "/biblioteca/libro",
    element: <LibroPage />, // Página Libro de Biblioteca
  },
  {
    path: "/biblioteca/prestamo",
    element: <PrestamoPage />, // Página Prestamo de Biblioteca
  },
  {
    path: "/biblioteca/reporte-libros-por-dia",
    element: <ReporteLibrosPorDia />, // Página Reporte 1 de Biblioteca
  },
  {
    path: "/biblioteca/reporte-cruzado",
    element: <ReporteCruzado />, // Página reporte 2 de Biblioteca
  },

  // Rutas para el módulo de Nómina
  {
    path: "/nomina",
    element: <IndexNom />,  // Página principal de Nómina
  },

  // Rutas para el módulo de Selección
  {
    path: "/seleccion",
    element: <IndexSelec />, // Página principal de Selección
  },

  // Ruta para el formulario de registro
  {
    path: "/signup",
    element: <Formulario />,  // Página de formulario de registro
  },
]);

// Renderizado de la aplicación en el DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
