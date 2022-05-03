import { getMessages } from "../services/message";
import MessagesList from "../components/MessagesList";
import "./HomeFeed.css";
import MessageArea from "../components/MessageArea";
import {
  ServiceStatus,
  useMessagesReducer,
  useService,
} from "../utils/extra-hooks";
import { useAuth } from "../providers/AuthProvider";
import { useOutletContext } from "react-router-dom";
import { MainLayoutOutlet } from "../layouts/MainLayout";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import { EmptyPlaceholder } from "../components/EmptyPlaceholder";

export default function HomeFeed() {
  const [
    messages,
    { load, create, removeMessage, addFriend, removeFriend, like, unlike },
  ] = useMessagesReducer();
  const { id: uid } = useAuth().user!;
  const { refMessageArea } = useOutletContext<MainLayoutOutlet>();

  const { status } = useService(getMessages.bind(null, undefined), load, []);

  return (
    <div className="responsive-container">
      <div className="home-feed">
        <div className="home-message-area">
          <MessageArea
            refArea={refMessageArea}
            id="search"
            onSubmit={(content) => create({ content })}
            minLength={8}
            maxLength={320}
          />
        </div>
        {status === ServiceStatus.LOADING ? (
          <LoadingPlaceholder />
        ) : messages.length > 0 ? (
          <>
            <MessagesList
              messages={messages}
              friendActions={{ add: addFriend, remove: removeFriend }}
              likeActions={{ like, unlike }}
              uid={uid}
              removeAction={removeMessage}
            />
          </>
        ) : (
          <EmptyPlaceholder />
        )}
      </div>
    </div>
  );
}
