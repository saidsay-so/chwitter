import React from "react";
import "./Message.css";
import SimpleButton from "./SimpleButton";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import UserElement from "./User";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import cx from "classnames";
import { CSSTransition } from "react-transition-group";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { User } from "../services/user";
import FriendButton from "./FriendButton";
import { BiMessageRoundedMinus } from "react-icons/bi";
import { Trans } from "@lingui/macro";

dayjs.extend(relativeTime);

interface MessageProps {
  /**
   * Message
   */
  content: string;
  /**
   * Auteur
   */
  author: User;
  /**
   * Date de création
   */
  date: number;
  /**
   * Appelé lors de la pression du bouton d'ajout/suppression d'ami
   */
  friendAction: VoidFunction;
  /**
   * Indique si l'auteur du message est le lecteur
   */
  fromHimself: boolean;
  /**
   * Indique si le lecteur a liké le message
   */
  isLiked: boolean;
  /**
   * Nombre de likes
   */
  likes: number;
  /**
   * Appelé lors de la pression du bouton d'ajout/suppression de like
   */
  likeAction: VoidFunction;

  removeAction: VoidFunction;

  connected: boolean;
}

/**
 * Affiche un message
 */
const Message = ({
  content,
  author: { name, profileLink, avatarLink, description, isFriend, displayName },
  date,
  friendAction,
  likes,
  isLiked,
  likeAction,
  fromHimself,
  removeAction,
  connected = true,
}: MessageProps) => {
  return (
    <article className={cx("message-container", { isLiked })}>
      <div className="author-info">
        <div className="avatar-container">
          <Avatar profileLink={profileLink} picture={avatarLink} name={name} />
        </div>
        <div>
          <Link to={profileLink} className="author">
            <h4 className="author-display">{displayName}</h4>
            <span>@{name}</span>
          </Link>
        </div>
        <div className="user-details">
          <UserElement
            isFriend={fromHimself ? undefined : isFriend}
            friendAction={() => friendAction()}
            description={description}
            name={name}
            avatarLink={avatarLink}
            displayName={displayName}
            profileLink={profileLink}
            connected={connected}
          />
        </div>
      </div>
      <p className="message">{content}</p>
      <div className="metadata">
        <span className="likes">
          <button
            disabled={!connected}
            onClick={() => likeAction()}
            className="like-button"
          >
            <CSSTransition in={isLiked} timeout={100}>
              <div className="like-icon">
                {isLiked ? <BsHeartFill /> : <BsHeart />}
              </div>
            </CSSTransition>
          </button>
          {likes}
        </span>
        <span className="date">{dayjs(date).fromNow()}</span>
        <div className={cx("actions")}>
          {connected && !fromHimself && (
            <FriendButton isFriend={isFriend} onClick={() => friendAction()} />
          )}
          {connected && fromHimself && (
            <SimpleButton
              label={
                <div>
                  <BiMessageRoundedMinus className="icon" />{" "}
                  <Trans>Supprimer le message</Trans>
                </div>
              }
              className={cx("delete-action")}
              onClick={() => removeAction()}
            />
          )}
        </div>
      </div>
    </article>
  );
};
export default Message;
