import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import MessagesList from "../../components/MessagesList";
import { useAuth } from "../../providers/AuthProvider";
import { getMessages } from "../../services/message";
import {
  useService,
  useMessagesReducer,
  ServiceStatus,
} from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Messages.css";

export default function UserMessages() {
  const { uid, setMsgCount } = useOutletContext<UserProfileOutletContext>();
  const { id: mainUid } = useAuth().user!;
  const [
    messages,
    { load, like, removeMessage, unlike, addFriend, removeFriend },
  ] = useMessagesReducer();

  const { status } = useService(getMessages.bind(null, { uid }), load, [uid]);

  useEffect(() => {
    setMsgCount(status === ServiceStatus.LOADING ? null : messages.length);
  }, [messages]);

  console.log(status === ServiceStatus.LOADING);

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
