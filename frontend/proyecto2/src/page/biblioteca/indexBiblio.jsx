
import { Link } from "react-router-dom";
import { MenuHeader } from "../../moduls/Menu_header";

export function IndexBiblio() {
  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/home" title2="Home" link2="/" />
      <h1 className="title_index">Biblioteca</h1>
      <div className="container_cont">
        <ul className="cont">
          <li className="cont_item">
            <Link to="/crear-autor-biblio">Crear Autor</Link>
          </li>
          <li className="cont_item">
            <Link to="/cuenta">Crear Libro</Link>
          </li>
          <li className="cont_item">
            <Link to="/comprobante">Prestámo de Libros </Link>
          </li>
          <li className="cont_item">
            <Link to="/balance">Reporte cruzado Libro Autores</Link>
          </li>
          <li className="cont_item">
            <Link to="/resultado">Reporte por fechas </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}