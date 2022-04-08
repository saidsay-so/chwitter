import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MessagesList from "../../components/MessagesList";
import { getMessages, Message } from "../../services/message";
import { useAsyncEffect } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";

const UserMessages = () => {
  const { id, isHimself, friendAction, likeAction } =
    useOutletContext<UserProfileOutletContext>();

  const [messages, setMessages] = useState<Message[]>([]);

  useAsyncEffect(
    async (stillMounted) => {
      const messages = await getMessages(id);

      if (stillMounted()) {
        setMessages(messages);
      }
    },
    [id]
  );

  return (
    <div className="messages-container">
      <MessagesList
        messages={messages}
        fromHimself={isHimself}
        friendAction={friendAction}
        likeAction={likeAction}
      />
    </div>
  );
};

export default UserMessages;
