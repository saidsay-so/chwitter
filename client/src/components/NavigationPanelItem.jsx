import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import "./NavigationPanelItem.css";

/**
 * Élément constituant le panneau de navigation
 */
const Item = ({ icon, text, link, action }) => {
  const Element = action ? "div" : NavLink;
  const props = action ? { onClick: action } : { to: link };

  return (
    <li title={text} className="panel-item">
      <button className="panel-button">
        <Element {...props} className="action-wrapper">
          <span className="icon">{icon}</span>
        </Element>
      </button>
    </li>
  );
};

export default Item;

Item.propTypes = {
  /**
   * 
   */
  icon: PropTypes.oneOfType(PropTypes.element, PropTypes.string),
  text: PropTypes.string,
  link: PropTypes.string,
  action: PropTypes.func,
};
