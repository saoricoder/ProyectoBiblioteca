import "../css/menu_header.css";
import { Link } from "react-router-dom";

export function MenuHeader(props) {
  return (
    <div className="item_header">
      <div className="item_container">
        <h1 className="title_header">
          PROYECTO PARCIAL 2 – APLICACIONES DISTRIBUIDAS
        </h1>
        <ul className="menu_item">
          <li className="item_menu">
            <Link to={props.link1}>{props.title1}</Link>
          </li>
          <li className="item_menu">
            <Link to={props.link2}>{props.title2}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
