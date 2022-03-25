import SimpleButton from "./SimpleButton";
import "./FriendButton.css";

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
