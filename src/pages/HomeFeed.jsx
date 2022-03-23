import { getMessages } from "../services/message";
import MessagesList from "../components/MessagesList";
import "./HomeFeed.css";
import MessageArea from "../components/MessageArea";
import { useAsyncEffect } from "../utils/extra-hooks";
import { areFriends } from "../services/friend";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";

export default function HomeFeed() {
  const [messages, setMessages] = useState([]);
  const {
    user: { id },
  } = useAuth();

  useAsyncEffect(async (stillMounted) => {
    const rawMessages = await getMessages();

    const messages = await Promise.all(
      rawMessages.map(async (msg) => {
        const fromHimself = id === msg.authorId;
        const isFriend = fromHimself
          ? false
          : await areFriends(id, msg.authorId);
        return { ...msg, isFriend, fromHimself };
      })
    );

    if (stillMounted) {
      setMessages(messages);
    }
  }, []);

  return (
    <div className="home-feed">
      <h1>Accueil</h1>
      <MessageArea />
      <MessagesList messages={messages} friendAction={console.log} />
    </div>
  );
}
