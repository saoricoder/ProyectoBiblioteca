/* import ChatAyuda from "../moduls/chatAyuda"; */
import HelpChat from "../moduls/chatHub";
import { MenuHeader } from "../moduls/Menu_header";
import { Link } from "react-router-dom";
import { Logout } from "../services/user.services/Login.services";

export function Menu() {
  const handleLogout = async () => {
    try {
      // Cerrar sesión
      const response = await Logout();
      if (response.success) {
        console.log("Sesión cerrada");
        // Redirigir a la página de inicio
        window.location.href = "/";
      } else {
        console.error("Error al cerrar sesión:", response.error);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const menuItems = [
    { link: "/home", title: "Inicio" },
    //{ link: "/registro", title: "Registro" },
    {
      isButton: true,
      title: "Cerrar sesión",
      action: handleLogout, // Enviamos el método para cerrar sesión
    },
  ];
  return (
    <div className="container">
      <MenuHeader menuItems={menuItems} />
      <h1>Menu</h1>
      <div className="container_menu">
        <ul className="menu">
          <li className="menu_item">
            <Link to="/biblioteca">Biblioteca</Link>
          </li>
          <li className="menu_item">
            <Link to="/contabilidad">Contabilidad</Link>
          </li>
          <li className="menu_item">
            <Link to="/nomina">Nomina</Link>
          </li>
          <li className="menu_item">
            <Link to="/seleccion">Seleccion</Link>
          </li>
        </ul>
        <HelpChat />
      </div>
    </div>
  );
}
