import React, { lazy } from "react";
import PropTypes from "prop-types";
import "./Message.css";
import SimpleButton from "./SimpleButton";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import User from "./User";

const Message = ({
  message,
  authorPicture,
  author,
  authorProfileLink,
  date,
  description,
  isFriend,
  friendAction,
  fromHimself,
}) => (
  <article className="message-container">
    <div className="author-info">
      <Avatar
        profileLink={authorProfileLink}
        picture={authorPicture}
        name={author}
      />
      <Link to={authorProfileLink} className="author">
        {author}
      </Link>
      <div className="user-details">
        {!fromHimself && (
          <User
            isFriend={isFriend}
            friendAction={friendAction ?? undefined}
            description={description}
            name={author}
            picture={authorPicture}
            profileLink={authorProfileLink}
            author={author}
          />
        )}
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
