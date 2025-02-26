import { Formulario } from "./page/Login";
import "./App.css";
import { MenuHeader } from "./moduls/Menu_header";

function App() {
  const menuItems = [
    { link: "/login", title: "Inicio" },
    { link: "/registro", title: "Registro" },
    /* {
      isButton: true,
      title: "Cerrar sesión",
      action: handleLogout,  // Enviamos el método para cerrar sesión
    }, */
  ];
  return (
    <div className="container">
      <MenuHeader menuItems={menuItems} />
      <Formulario />
    </div>
  );
}

export default App;
