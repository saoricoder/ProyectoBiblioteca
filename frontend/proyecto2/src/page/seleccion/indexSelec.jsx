import { Link } from "react-router-dom";
import { MenuHeader } from "../../moduls/Menu_header";
import HelpChat from "../../moduls/chatHub";

export function IndexSelec() {
  return (
    <div className="container">
      <MenuHeader title1="Atras" link1="/home" title2="Home" link2="/" />
      <h1 className="title_index">Seleccion</h1>
      <div className="container_selec">
        <ul className="selec">
          <li className="cont_item">
            <Link to="/solicitud">Solicitud de Empleo</Link>
          </li>
          <li className="cont_item">
            <Link to="/entrevista">Entrevista</Link>
          </li>
          <li className="cont_item">
            <Link to="/evaluacion">Pruebas</Link>
          </li>
          <li className="cont_item">
            <Link to="/ranking">Contratacion</Link>
          </li>
          <li className="cont_item">
            <Link to="/cruzada">Cruzada</Link>
          </li>
        </ul>
      </div>
      <HelpChat />
    </div>
  );
}
