import React from "react";
import User from "./User";
import "./Message.css";
import SimpleButton from "./SimpleButton";

const Message = ({
  message,
  authorPicture,
  author,
  authorProfileLink,
  authorId,
  date,
  isFriend,
  addAuthor,
}) => {
  const addCallback = () => addAuthor(authorId);

  return (
    <article className="message-container">
      <div className="author-info">
        <a className="picture" href={authorProfileLink}>
          <img src={authorPicture} alt={`Photo de ${author}`} />
        </a>
        <a href={authorProfileLink} className="author">
          {author}
        </a>
        <User
          isFriend={isFriend}
          className="user-details"
          action={addCallback}
          description="A cool doggo"
          name={author}
          picture={authorPicture}
          profileLink={authorProfileLink}
          author={author}
        />
      </div>
      <p className="message">{message}</p>
      <div className="metadata">
        <span className="date">{date}</span>
        {!isFriend && (
          <SimpleButton
            label="Ajouter l'auteur"
            className="action"
            onClick={addCallback}
          />
        )}
      </div>
    </article>
  );
};

export default Message;
