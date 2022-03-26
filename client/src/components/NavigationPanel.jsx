import PropTypes from "prop-types";
import "./NavigationPanel.css";
import Item from "./NavigationPanelItem";
import { Link } from "react-router-dom";
import { MdAdd, MdLogout } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import Avatar from "./Avatar";

/**
 * Panneau de navigation contenant les actions principales
 */
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
  /**
   * Fontion de déconnextion
   */
  signOut: PropTypes.func.isRequired,
  /**
   * Fontion pour afficher le champ d'envoi de message
   */
  createMessage: PropTypes.func.isRequired,
  /**
   * Lien vers la page d'accueil
   */
  homePage: PropTypes.string.isRequired,
  /**
   * Lien vers la photo de profil du lecteur
   */
  picture: PropTypes.string,
  /**
   * Nom du lecteur
   */
  name: PropTypes.string,
  /**
   * Lien vers le profil du lecteur
   */
  profileLink: PropTypes.string,
};
