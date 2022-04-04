import PropTypes from "prop-types";
import "./User.css";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import FriendButton from "./FriendButton";

/**
 * Composant affichant les informations d'un utilisateur
 */
const User = ({
  isFriend,
  profileLink,
  picture,
  name,
  description,
  action,
}) => {
  return (
    <div className="user">
      <Avatar profileLink={profileLink} picture={picture} name={name} />
      <div className="text">
        <Link to={profileLink} className="name">
          {name}
        </Link>
        <p className="description">{description}</p>
      </div>
      <FriendButton action={action} isFriend={isFriend} />
    </div>
  );
};

export default User;

User.propTypes = {
  /**
   * Indique si il s'agit d'un ami
   */
  isFriend: PropTypes.bool,
  /**
   * Lien vers le profil du lecteur
   */
  profileLink: PropTypes.string.isRequired,
  /**
   * Lien vers la photo de profil de l'utilisateur
   */
  picture: PropTypes.string.isRequired,
  /**
   * Nom du lecteur
   */
  name: PropTypes.string.isRequired,
  /**
   * Description du lecteur
   */
  description: PropTypes.string.isRequired,
  /**
   * Fonction d'ajout/suppression en tant qu'ami
   */
  action: PropTypes.func.isRequired,
};
