import { Link } from "react-router-dom";
import { MenuHeader } from "../../moduls/Menu_header";
import "../../css/biblioteca/indexBiblio.css";
import HelpChat from "../../moduls/chatHub";

export function IndexBiblio() {
  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/home" title2="Home" link2="/" />
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
