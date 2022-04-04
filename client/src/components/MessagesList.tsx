import PropTypes from "prop-types";
import Message from "./Message";
import "./MessagesList.css";

/**
 * Affiche une liste de messages
 */
const MessagesList = ({ messages, friendAction, likeAction }) => {
  return (
    <ul className="messages">
      {messages.map((msg) => (
        <li key={msg.id}>
          <Message
            friendAction={friendAction?.bind(null, msg.authorId)}
            likeAction={likeAction?.bind(null, msg.id)}
            {...msg}
          />
        </li>
      ))}
    </ul>
  );
};

export default MessagesList;

MessagesList.propTypes = {
  /**
   * Liste des messages
   */
  messages: PropTypes.array.isRequired,
  /**
   * Action d'ajout/suppression d'ami
   */
  friendAction: PropTypes.func,
  /**
   * Indique si c'est un ami (lorsqu'il y n'y a qu'un seul auteur)
   */
  isFriend: PropTypes.bool,
  /**
   * Indique si l'auteur est le lecteur (lorsqu'il y n'y a qu'un seul auteur)
   */
  fromHimself: PropTypes.bool,
};
