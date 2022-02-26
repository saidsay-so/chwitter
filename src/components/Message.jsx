import React from "react";

const Message = ({ message, author, authorId, date, addAuthor }) => {
  return (
    <article>
      <p>{message}</p>
      <div>
        <span>{date}</span>
        <span>{author}</span>
        {addAuthor !== undefined && (
          <button onClick={() => addAuthor(authorId)}>Ajouter l'auteur</button>
        )}
      </div>
    </article>
  );
};

export default Message;
