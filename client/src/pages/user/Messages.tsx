import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MessagesList from "../../components/MessagesList";
import { addFriend, removeFriend } from "../../services/friend";
import {
  getMessages,
  likeMessage,
  Message,
  unlikeMessage,
} from "../../services/message";
import { useAsyncEffect } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";

const UserMessages = () => {
  const { uid, isHimself } = useOutletContext<UserProfileOutletContext>();

  const [messages, setMessages] = useState<Message[]>([]);

  useAsyncEffect(
    async (stillMounted) => {
      const messages = await getMessages({ uid });

      if (stillMounted()) {
        setMessages(messages);
      }
    },
    [uid]
  );

  return (
    <div className="messages-container">
      <MessagesList
        messages={messages}
        fromHimself={isHimself}
        friendActions={{ add: addFriend, remove: removeFriend }}
        likeActions={{ like: likeMessage, unlike: unlikeMessage }}
      />
    </div>
  );
};

export default UserMessages;
