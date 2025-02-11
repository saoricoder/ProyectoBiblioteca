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
import {CrearAutor} from "./page/biblioteca/SimplePage/simpleUno";

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
    path: "/crear-autor-biblio",
    element: <CrearAutor />, // Página principal de Biblioteca
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
