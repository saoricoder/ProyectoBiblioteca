import "../css/menu_header.css";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export function MenuHeader({ menuItems = [] }) {
  const navigate = useNavigate();

  return (
    <div className="item_header">
      <div className="item_container">
        <h1 className="title_header">
          PROYECTO PARCIAL 2 – APLICACIONES DISTRIBUIDAS
        </h1>
        <ul className="menu_item">
          {menuItems?.map((item, index) => (
            <li key={index} className="item_menu">
              {item.isButton ? (
                <button className="logout_button" onClick={item.action}>
                  {item.title}
                </button>
              ) : (
                <Link to={item.link}>{item.title}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

MenuHeader.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      isButton: PropTypes.bool,
      action: PropTypes.func,
      link: PropTypes.string
    })
  )
};
