import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { IndexCont } from "./page/contabilidad/indexCont";
import { Menu } from "./page/Menu";
import { IndexBiblio } from "./page/biblioteca/indexBiblio";
import { IndexNom } from "./page/nomina/indexNom";
import { IndexSelec } from "./page/seleccion/indexSelec";
import { Formulario } from "./page/Formulario";
import { SimpleUno } from "./page/contabilidad/SimplePage/simpleUno";
import { SimpleDos } from "./page/contabilidad/SimplePage/SimpleDos";
import { ComplexUno } from "./page/contabilidad/ComplexPage/complejaUno";
import { ReporteUno } from "./page/contabilidad/ComplexPage/reporteUno";
import { ReporteDos } from "./page/contabilidad/ComplexPage/reporteDos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/contabilidad",
    element: <IndexCont />,
  },
  {
    path: "/home",
    element: <Menu />,
  },
  {
    path: "/biblioteca",
    element: <IndexBiblio />,
  },
  {
    path: "/nomina",
    element: <IndexNom />,
  },
  {
    path: "/seleccion",
    element: <IndexSelec />,
  },
  {
    path: "/signup",
    element: <Formulario />,
  },
  {
    path: "/tipocuenta",
    element: <SimpleUno />,
  },
  {
    path: "/cuenta",
    element: <SimpleDos />,
  },
  {
    path: "/comprobante",
    element: <ComplexUno />,
  },
  {
    path: "/balance",
    element: <ReporteUno />,
  },
  {
    path: "/resultado",
    element: <ReporteDos />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
