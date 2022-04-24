import { useState, useTransition } from "react";
import { useOutletContext } from "react-router-dom";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { LoadingPlaceholder } from "../../components/LoadingPlaceholder";
import MessagesList from "../../components/MessagesList";
import { useAuth } from "../../providers/AuthProvider";
import { getMessages } from "../../services/message";
import { useAsyncEffect, useMessagesReducer } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";
import "./Messages.css";

const UserMessages = () => {
  const { uid } = useOutletContext<UserProfileOutletContext>();
  const { id: mainUid } = useAuth().user!;
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [
    messages,
    { load, like, removeMessage, unlike, addFriend, removeFriend },
  ] = useMessagesReducer();

  useAsyncEffect(
    async (stillMounted) => {
      const messages = await getMessages({ uid });
      setIsLoading(false);

      if (stillMounted()) {
        startTransition(() => load(messages));
      }
    },
    [uid]
  );

  return (
    <div className="messages-container">
      {isPending || isLoading ? (
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
};

export default UserMessages;
