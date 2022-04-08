import React, { MouseEventHandler, useState } from "react";
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
   * Indique si il s'agit d'un ami
   */
  isFriend?: boolean;
  /**
   * Appelé lors de la pression du bouton d'ajout/suppression d'ami
   */
  friendAction: VoidFunction;
  /**
   * Indique si l'auteur du message est le lecteur
   */
  fromHimself?: boolean;
  /**
   * Indique si le lecteur a liké le message
   */
  isLiked?: boolean;
  /**
   * Nombre de likes
   */
  likes: number;
  /**
   * Appelé lors de la pression du bouton d'ajout/suppression de like
   */
  likeAction: VoidFunction;
}

/**
 * Affiche un message
 */
const Message = ({
  content,
  author: { name, profileLink, avatarLink, description },
  date,
  isFriend,
  friendAction,
  fromHimself,
  likes,
  isLiked,
  likeAction,
}: MessageProps) => {
  return (
    <article className={cx("message-container", { isLiked })}>
      <div className="author-info">
        <div className="avatar-container">
          <Avatar profileLink={profileLink} picture={avatarLink} name={name} />
        </div>
        <Link to={profileLink} className="author">
          {name}
        </Link>
        <div className="user-details">
          <UserElement
            isFriend={isFriend}
            friendAction={friendAction ?? undefined}
            description={description}
            name={name}
            avatarLink={avatarLink}
            profileLink={profileLink}
          />
        </div>
      </div>
      <p className="message">{content}</p>
      <div className="metadata">
        <span className="likes">
          <button onClick={likeAction} className="like-button">
            <CSSTransition in={isLiked} timeout={100}>
              <div className="like-icon">
                {isLiked ? <BsHeartFill /> : <BsHeart />}
              </div>
            </CSSTransition>
          </button>
          {likes}
        </span>
        <span className="date">{dayjs(date).fromNow()}</span>
        <SimpleButton
          label="➕ Ajouter"
          className={cx("action", { isVisible: !(isFriend || fromHimself) })}
          onClick={friendAction ?? undefined}
        />
      </div>
    </article>
  );
};
export default Message;
