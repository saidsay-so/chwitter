import React from "react";
import PropTypes from "prop-types";
import User from "./User";
import "./Message.css";
import SimpleButton from "./SimpleButton";
import Avatar from "./Avatar";

const Message = ({
  message,
  authorPicture,
  author,
  authorProfileLink,
  date,
  isFriend,
  action,
}) => (
  <article className="message-container">
    <div className="author-info">
      <Avatar profileLink={authorProfileLink} picture={authorPicture} />
      <a href={authorProfileLink} className="author">
        {author}
      </a>
      <div className="user-details">
        <User
          isFriend={isFriend}
          action={action}
          description="A cool doggo"
          name={author}
          picture={authorPicture}
          profileLink={authorProfileLink}
          author={author}
        />
      </div>
    </div>
    <p className="message">{message}</p>
    <div className="metadata">
      <span className="date">{date}</span>
      {!isFriend && (
        <SimpleButton
          label="Ajouter l'auteur"
          className="action"
          onClick={action}
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
  action: PropTypes.func.isRequired,
};
