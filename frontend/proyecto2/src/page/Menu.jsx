import { MenuHeader } from "../moduls/Menu_header";
import { Link } from "react-router-dom";

export function Menu() {
  return (
    <div className="container">
      <MenuHeader title1="Home" link1="/" title2="Cerrar Sesion" link2="/" />
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
      </div>
    </div>
  );
}
