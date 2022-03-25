import { createMessage, getMessages } from "../services/message";
import MessagesList from "../components/MessagesList";
import "./HomeFeed.css";
import MessageArea from "../components/MessageArea";
import { useAsyncEffect } from "../utils/extra-hooks";
import { areFriends } from "../services/friend";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function HomeFeed() {
  const [messages, setMessages] = useState([]);
  const {
    user: { id: uid },
  } = useAuth();
  const { refMessageArea } = useOutletContext();

  useAsyncEffect(async (stillMounted) => {
    const rawMessages = await getMessages();

    const messages = await Promise.all(
      rawMessages.map(async (msg) => {
        const fromHimself = uid === msg.authorId;
        const isFriend = fromHimself
          ? false
          : await areFriends(uid, msg.authorId);
        return { ...msg, isFriend, fromHimself };
      })
    );

    if (stillMounted) {
      setMessages(messages);
    }
  }, []);

  return (
    <div className="home-feed">
      <div className="responsive-container">
        <MessageArea
          refArea={refMessageArea}
          id="search"
          onSubmit={createMessage.bind(null, uid)}
        />
        <MessagesList messages={messages} friendAction={console.log} />
      </div>
    </div>
  );
}
