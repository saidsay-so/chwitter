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
  friendActions: {
    add: (authorId: User["id"]) => void;
    remove: (authorId: User["id"]) => void;
  };
  /**
   * ID du lecteur
   */
  uid?: User["id"];
  /**
   * Action d'ajout/suppression du like
   */
  likeActions: {
    like: (messageId: Message["id"], index: number) => void;
    unlike: (messageId: Message["id"], index: number) => void;
  };

  removeAction: (mid: Message["id"], index: number) => void;
}

/**
 * Affiche une liste de messages
 */
const MessagesList = ({
  messages,
  friendActions: { add, remove },
  likeActions: { like, unlike },
  uid,
  removeAction,
}: MessagesListProps) => {
  return (
    <ul className="messages">
      {messages.map((msg, i) => (
        <li key={msg.id}>
          <MessageElement
            friendAction={(msg.author.isFriend ? remove : add)?.bind(
              null,
              msg.author.id
            )}
            likeAction={(msg.isLiked ? unlike : like)?.bind(null, msg.id, i)}
            fromHimself={msg.author.id === uid}
            removeAction={removeAction.bind(null, msg.id, i)}
            {...msg}
            connected={!!uid}
          />
        </li>
      ))}
    </ul>
  );
};

export default MessagesList;
