import SimpleButton from "./SimpleButton";
import "./FriendButton.css";
import cx from "classnames";
import { ComponentPropsWithoutRef } from "react";

/**
 * Spécialisation de [SimpleButton](#simplebutton) avec une étiquette pour l'ajout/suppression d'amis
 */
const FriendButton = ({ isFriend, className, ...props }: FriendButtonProps) => (
  <SimpleButton
    {...props}
    className={cx("friend-button", className, { "is-friend": isFriend })}
    label={isFriend ? "➖ Supprimer des amis" : "➕ Ajouter aux amis"}
  />
);

export default FriendButton;

interface FriendButtonProps
  extends ComponentPropsWithoutRef<typeof SimpleButton> {
  /**
   * Indique si il s'agit d'un ami
   */
  isFriend?: boolean;
}
