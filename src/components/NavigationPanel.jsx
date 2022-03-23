import PropTypes from "prop-types";
import "./NavigationPanel.css";
import Item from "./NavigationPanelItem";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const NavigationPanel = ({ signOut, homePage, picture, name, profileLink }) => (
  <aside className="panel">
    <Link to={homePage} className="title">
      <h2>Chwitter</h2>
    </Link>
    <menu className="panel-actions">
      <Item
        icon={<img src={picture} alt={name} />}
        link={profileLink}
        text="Profil"
      />
    </menu>
  </aside>
);

export default NavigationPanel;

NavigationPanel.propTypes = {
  authAction: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  picture: PropTypes.string,
  name: PropTypes.string,
  profileLink: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,
};
