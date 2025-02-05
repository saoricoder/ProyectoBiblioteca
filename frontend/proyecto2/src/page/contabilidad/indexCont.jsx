import { Link } from "react-router-dom";
import { MenuHeader } from "../../moduls/Menu_header";

export function IndexCont() {
  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/home" title2="Home" link2="/" />
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
    </div>
  );
}
