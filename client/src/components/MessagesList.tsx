import { Message } from "../services/message";
import { User } from "../services/user";
import MessageElement from "./Message";
import "./MessagesList.css";

interface MessagesListProps {
  /**
   * Liste des messages
   */
  messages: Message[];
  /**
   * Action d'ajout/suppression d'ami
   */
  friendAction: (authorId: User["id"]) => void;
  /**
   * Indique si l'auteur est le lecteur (si tous les messages viennent du même auteur)
   */
  fromHimself?: boolean;
  /**
   * Action d'ajout/suppression du like
   */
  likeAction: (messageId: Message["id"]) => void;
}

/**
 * Affiche une liste de messages
 */
const MessagesList = ({
  messages,
  friendAction,
  likeAction,
  fromHimself,
}: MessagesListProps) => {
  return (
    <ul className="messages">
      {messages.map((msg) => (
        <li key={msg.id}>
          <MessageElement
            friendAction={friendAction?.bind(null, msg.author.id)}
            likeAction={likeAction?.bind(null, msg.id)}
            fromHimself={fromHimself}
            {...msg}
          />
        </li>
      ))}
    </ul>
  );
};

export default MessagesList;
