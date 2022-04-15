import {
  createMessage,
  getMessages,
  likeMessage,
  unlikeMessage,
} from "../services/message";
import MessagesList from "../components/MessagesList";
import "./HomeFeed.css";
import MessageArea from "../components/MessageArea";
import { useAsyncEffect } from "../utils/extra-hooks";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MainLayoutOutlet } from "../layouts/MainLayout";
import { Message } from "../services/message";
import { addFriend, removeFriend } from "../services/friend";

export default function HomeFeed() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { id: uid } = useAuth().user!;
  const { refMessageArea } = useOutletContext<MainLayoutOutlet>();

  useAsyncEffect(async (stillMounted) => {
    const rawMessages = await getMessages();

    const messages = await Promise.all(
      rawMessages.map(async (msg) => {
        return { ...msg, fromHimself: msg.author.id == uid };
      })
    );

    if (stillMounted()) {
      setMessages(messages);
    }
  }, []);

  return (
    <div className="home-feed">
      <div className="responsive-container">
        <MessageArea
          refArea={refMessageArea}
          id="search"
          onSubmit={createMessage}
        />
        <MessagesList
          messages={messages}
          friendActions={{ add: addFriend, remove: removeFriend }}
          likeActions={{ like: likeMessage, unlike: unlikeMessage }}
        />
      </div>
    </div>
  );
}
