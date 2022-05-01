import SimpleButton from "./SimpleButton";
import "./FriendButton.css";
import cx from "classnames";
import { ComponentPropsWithoutRef } from "react";
import { BiUserMinus, BiUserPlus } from "react-icons/bi";

/**
 * Spécialisation de [SimpleButton](#simplebutton) avec une étiquette pour l'ajout/suppression d'amis
 */
const FriendButton = ({ isFriend, className, ...props }: FriendButtonProps) => {
  const Icon = isFriend ? BiUserMinus : BiUserPlus;
  const label = isFriend ? "Supprimer des amis" : "Ajouter aux amis";

  return (
    <SimpleButton
      {...props}
      className={cx("friend-button", className, { "is-friend": isFriend })}
      label={
        <div>
          <span>
            <Icon className="friend-icon" />
            {label}
          </span>
        </div>
      }
    />
  );
};

export default FriendButton;

interface FriendButtonProps
  extends ComponentPropsWithoutRef<typeof SimpleButton> {
  /**
   * Indique si il s'agit d'un ami
   */
  isFriend?: boolean;
}
