import { Link } from "react-router-dom";

export function MenuItem(props) {
  return (
    <li className="item_menu">
      <Link to={props.link}>{props.title}</Link>
    </li>
  );
}
