import { Link } from "react-router-dom";
import { MenuHeader } from "../../moduls/Menu_header";
import "../../css/biblioteca/indexBiblio.css";
import HelpChat from "../../moduls/chatHub";
import { Logout } from "../../services/user.services/Login.services";

export function IndexBiblio() {
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
    //{ link: "/biblioteca", title: "Atras" },
    {
      isButton: true,
      title: "Cerrar sesión",
      action: handleLogout, // Enviamos el método para cerrar sesión
    },
  ];
  return (
    <div className="container">
      <MenuHeader menuItems={menuItems} />
      <h1 className="title_index">Biblioteca</h1>
      <div className="container_cont">
        <ul className="cont">
          <li className="cont_item">
            <Link to="/biblioteca/autor">Autores</Link>
          </li>
          <li className="cont_item">
            <Link to="/biblioteca/libro">Libros</Link>
          </li>
          <li className="cont_item">
            <Link to="/biblioteca/prestamo">Prestámos </Link>
          </li>
          <li className="cont_item">
            <Link to="/biblioteca/reporte-libros-por-dia">
              Reporte de libros por Día
            </Link>
          </li>
          <li className="cont_item">
            <Link to="/biblioteca/reporte-cruzado">Reporte Cruzado </Link>
          </li>
        </ul>
      </div>
      <HelpChat />
    </div>
  );
}
