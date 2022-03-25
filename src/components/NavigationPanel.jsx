import PropTypes from "prop-types";
import "./NavigationPanel.css";
import Item from "./NavigationPanelItem";
import { Link } from "react-router-dom";
import { MdAdd, MdLogout } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import { IconContext } from "react-icons";
import Avatar from "./Avatar";

const NavigationPanel = ({
  signOut,
  createMessage,
  homePage,
  picture,
  name,
  profileLink,
}) => (
  <aside className="panel">
    <Link to={homePage} className="title">
      <h2>Chwitter</h2>
    </Link>
    <div className="search-input">
      <input autoComplete="on" type="search" />
      <button className="search-button">
        <ImSearch />
      </button>
    </div>
    <menu className="panel-actions">
      <Avatar picture={picture} profileLink={profileLink} name={name} />
      <Item icon={<MdAdd />} text="Créer un message" action={createMessage} />
      <Item icon={<MdLogout />} text="Se déconnecter" action={signOut} />
    </menu>
  </aside>
);

export default NavigationPanel;

NavigationPanel.propTypes = {
  signOut: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  picture: PropTypes.string,
  name: PropTypes.string,
  profileLink: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  homePage: PropTypes.string.isRequired,
};
