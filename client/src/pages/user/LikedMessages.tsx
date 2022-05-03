import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import MessagesList from "../../components/MessagesList";
import { useAuth } from "../../providers/AuthProvider";
import { getMessages } from "../../services/message";
import {
  ServiceStatus,
  useMessagesReducer,
  useService,
} from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Messages.css";

export default function UserLikedMessages() {
  const { uid, setLikedMsgCount } =
    useOutletContext<UserProfileOutletContext>();
  const { id: mainUid } = useAuth().user!;
  const [
    messages,
    { load, like, removeMessage, unlike, addFriend, removeFriend },
  ] = useMessagesReducer(mainUid === uid);

  const { status } = useService(
    getMessages.bind(null, { uid, liked: "true" }),
    load,
    [uid]
  );

  useEffect(() => {
    setLikedMsgCount(status === ServiceStatus.LOADING ? null : messages.length);
  }, [messages]);

  return (
    <div className="messages-container">
      {status === ServiceStatus.LOADING ? (
        <LoadingPlaceholder />
      ) : messages.length > 0 ? (
        <MessagesList
          messages={messages}
          friendActions={{ add: addFriend, remove: removeFriend }}
          likeActions={{ like, unlike }}
          removeAction={removeMessage}
          uid={mainUid}
        />
      ) : (
        <EmptyPlaceholder />
      )}
    </div>
  );
}
