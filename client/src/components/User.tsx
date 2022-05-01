import "./User.css";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import FriendButton from "./FriendButton";
import { MouseEventHandler } from "react";

interface UserProps {
  /**
   * Indique si il s'agit d'un ami
   */
  isFriend?: boolean;
  /**
   * Lien vers le profil du lecteur
   */
  profileLink: string;
  /**
   * Lien vers la photo de profil de l'utilisateur
   */
  avatarLink: string;
  displayName: string;
  /**
   * Nom du lecteur
   */
  name: string;
  /**
   * Description du lecteur
   */
  description: string;
  /**
   * Fonction d'ajout/suppression en tant qu'ami
   */
  friendAction: VoidFunction;
}

/**
 * Composant affichant les informations d'un utilisateur
 */
const User = ({
  isFriend,
  profileLink,
  avatarLink,
  name,
  displayName,
  description,
  friendAction,
}: UserProps) => {
  return (
    <div className="user">
      {avatarLink && (
        <Avatar profileLink={profileLink} picture={avatarLink} name={name} />
      )}
      <div className="text">
        <Link to={profileLink} className="name">
          <h4>{displayName}</h4>@{name}
        </Link>
        <p className="description">{description}</p>
      </div>
      {isFriend !== undefined && (
          <FriendButton className="action" onClick={() => friendAction()} isFriend={isFriend} />
      )}
    </div>
  );
};

export default User;
