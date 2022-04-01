import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./Avatar.css";

/**
 * Affiche une photo de profil avec une bordure arrondie
 */
const Avatar = ({ profileLink, picture, name }) => (
  <div className="avatar">
    <Link to={profileLink}>
      <img src={picture} alt={`${name}`} />
    </Link>
  </div>
);

export default Avatar;

Avatar.propTypes = {
  /**
   * Lien vers le profil de l'utilisateur
   */
  profileLink: PropTypes.string.isRequired,
  /**
   * Image de profil
   */
  picture: PropTypes.string.isRequired,
  /**
   * Nom de l'utilisateur
   */
  name: PropTypes.string.isRequired,
};
