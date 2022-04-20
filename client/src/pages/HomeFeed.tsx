import { getMessages } from "../services/message";
import MessagesList from "../components/MessagesList";
import "./HomeFeed.css";
import MessageArea from "../components/MessageArea";
import { useAsyncEffect, useMessagesReducer } from "../utils/extra-hooks";
import { useAuth } from "../providers/AuthProvider";
import { useOutletContext } from "react-router-dom";
import { MainLayoutOutlet } from "../layouts/MainLayout";

export default function HomeFeed() {
  const [
    messages,
    { load, create, removeMessage, addFriend, removeFriend, like, unlike },
  ] = useMessagesReducer();
  const { id: uid } = useAuth().user!;
  const { refMessageArea } = useOutletContext<MainLayoutOutlet>();

  useAsyncEffect(async (stillMounted) => {
    const messages = await getMessages();

    if (stillMounted()) {
      load(messages);
    }
  }, []);

  return (
    <div className="home-feed">
      <div className="responsive-container">
        <MessageArea
          refArea={refMessageArea}
          id="search"
          onSubmit={(content) => create({ content })}
        />
        <MessagesList
          messages={messages}
          friendActions={{ add: addFriend, remove: removeFriend }}
          likeActions={{ like, unlike }}
          uid={uid}
          removeAction={removeMessage}
        />
      </div>
    </div>
  );
}
