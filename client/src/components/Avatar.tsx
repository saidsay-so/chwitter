import { Link } from "react-router-dom";

import "./Avatar.css";
interface AvatarProps {
  /**
   * Lien vers le profil de l'utilisateur
   */
  profileLink: string;
  /**
   * Image de profil
   */
  picture?: string;
  /**
   * Nom de l'utilisateur
   */
  name: string;
}

/**
 * Affiche une photo de profil avec une bordure arrondie
 */
const Avatar = ({ profileLink, picture, name }: AvatarProps) => (
  <div className="avatar">
    <Link to={profileLink}>
      <img src={picture} alt={`${name}`} />
    </Link>
  </div>
);

export default Avatar;
