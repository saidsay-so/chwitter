import SimpleButton from "./SimpleButton";
import "./FriendButton.css";
import PropTypes from "prop-types";

/**
 * Spécialisation de [SimpleButton](#simplebutton) avec une étiquette pour l'ajout/suppression d'amis
 */
const FriendButton = ({ action, isFriend, className }) => (
  <SimpleButton
    onClick={action}
    className={`friend-button${isFriend ? " is-friend" : ""}${
      className ? " " + className : ""
    }`}
    label={isFriend ? "➖ Supprimer des amis" : "➕ Ajouter aux amis"}
  />
);
export default FriendButton;

FriendButton.propTypes = {
  /**
   * @see Voir [SimpleButton](#simplebutton)
   */
  action: PropTypes.func.isRequired,
  /**
   * Indique si il s'agit d'un ami
   */
  isFriend: PropTypes.bool.isRequired,
  /**
   * @see Voir [SimpleButton](#simplebutton)
   */
  className: PropTypes.string,
};
