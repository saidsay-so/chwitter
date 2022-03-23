import { NavLink } from "react-router-dom";
import "./NavigationPanelItem.css";

const Item = ({ icon, text, link, action }) => {
  const Element = action ? <button /> : NavLink;
  const props = action ? { action } : { to: link };

  return (
    <li className="panel-item">
      <Element {...props} className="action-wrapper">
        <span className="icon">{icon}</span>
        {text}
      </Element>
    </li>
  );
};

export default Item;
