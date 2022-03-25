import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MessagesList from "../../components/MessagesList";
import { getMessages } from "../../services/message";
import { useAsyncEffect } from "../../utils/extra-hooks";

const UserMessages = () => {
  const { id, isFriend, isHimself, friendAction } = useOutletContext();

  const [messages, setMessages] = useState([]);

  useAsyncEffect(
    async (stillMounted) => {
      const messages = await getMessages(id);

      if (stillMounted) {
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
        isFriend={isFriend}
        friendAction={friendAction}
      />
    </div>
  );
};

export default UserMessages;
