import "../css/menu_header.css";
import { Link } from "react-router-dom";

export function MenuHeader({ menuItems }) {
  return (
    <div className="item_header">
      <div className="item_container">
        <h1 className="title_header">
          PROYECTO PARCIAL 2 – APLICACIONES DISTRIBUIDAS
        </h1>
        <ul className="menu_item">
          {menuItems.map((item, index) => (
            <li key={index} className="item_menu">
              {item.isButton ? (
                // Si es un botón, usamos un botón HTML que ejecuta el método
                <button className="logout_button" onClick={item.action}>
                  {item.title}
                </button>
              ) : (
                // Si es un enlace, usamos un <Link>
                <Link to={item.link}>{item.title}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
