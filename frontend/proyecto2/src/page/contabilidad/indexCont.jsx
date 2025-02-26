import { Link } from "react-router-dom";
import { MenuHeader } from "../../moduls/Menu_header";
import HelpChat from "../../moduls/chatHub";
import { Logout } from "../../services/user.services/Login.services";

export function IndexCont() {
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
    //{ link: "/contabilidad", title: "Atras" },
    {
      isButton: true,
      title: "Cerrar sesión",
      action: handleLogout, // Enviamos el método para cerrar sesión
    },
  ];
  return (
    <div className="container">
      <MenuHeader menuItems={menuItems} />
      <h1 className="title_index">Contabilidad</h1>
      <div className="container_cont">
        <ul className="cont">
          <li className="cont_item">
            <Link to="/tipocuenta">Tipo de Cuenta</Link>
          </li>
          <li className="cont_item">
            <Link to="/cuenta">Cuentas</Link>
          </li>
          <li className="cont_item">
            <Link to="/comprobante">Comprobante de Contabilidad</Link>
          </li>
          <li className="cont_item">
            <Link to="/balance">Balance General</Link>
          </li>
          <li className="cont_item">
            <Link to="/resultado">Estado de Resultados</Link>
          </li>
        </ul>
      </div>
      <HelpChat />
    </div>
  );
}
