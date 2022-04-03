import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Message.css";
import SimpleButton from "./SimpleButton";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import User from "./User";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import cx from "classnames";
import { CSSTransition } from "react-transition-group";

/**
 * Affiche un message
 */
const Message = ({
  message,
  author: { name, profileLink, picture, description },
  date,
  isFriend,
  friendAction,
  fromHimself,
  likes = "69",
  // isLiked,
  likeAction,
}) => {
  const [isLiked, setisLiked] = useState(false);

  return (
    <article className="message-container">
      <div className="author-info">
        <div className="avatar-container">
          <Avatar profileLink={profileLink} picture={picture} name={name} />
        </div>
        <Link to={profileLink} className="author">
          {name}
        </Link>
        <div className="user-details">
          <User
            isFriend={isFriend}
            friendAction={friendAction ?? undefined}
            description={description}
            name={name}
            picture={picture}
            profileLink={profileLink}
          />
        </div>
      </div>
      <p className="message">{message}</p>
      <div className="metadata">
        <span className={cx("likes", { isLiked })}>
          <button
            onClick={() => {
              setisLiked(!isLiked);
            }}
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
        <span className="date">{date}</span>
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

Message.propTypes = {
  /**
   * Message
   */
  message: PropTypes.string.isRequired,
  /**
   * Auteur
   */
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    profileLink: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  /**
   * Date de création
   */
  date: PropTypes.string.isRequired,
  /**
   * Indique si il s'agit d'un ami
   */
  isFriend: PropTypes.bool.isRequired,
  /**
   * Appelé lors de la pression du bouton d'ajout/suppression d'ami
   */
  friendAction: PropTypes.func.isRequired,
  /**
   * Indique si l'auteur du message est le lecteur
   */
  fromHimself: PropTypes.bool.isRequired,
};
