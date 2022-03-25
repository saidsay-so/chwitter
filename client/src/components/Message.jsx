import React from "react";
import PropTypes from "prop-types";
import "./Message.css";
import SimpleButton from "./SimpleButton";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import User from "./User";

const Message = ({
  message,
  author: { name, profileLink, picture, description },
  date,
  isFriend,
  friendAction,
  fromHimself,
}) => (
  <article className="message-container">
    <div className="author-info">
      <Avatar profileLink={profileLink} picture={picture} name={name} />
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
      <span className="date">{date}</span>
      {!(isFriend || fromHimself) && (
        <SimpleButton
          label="➕ Ajouter"
          className="action"
          onClick={friendAction ?? undefined}
        />
      )}
    </div>
  </article>
);

export default Message;

Message.propTypes = {
  message: PropTypes.string.isRequired,
  authorPicture: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorProfileLink: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isFriend: PropTypes.bool.isRequired,
  friendAction: PropTypes.func.isRequired,
};
