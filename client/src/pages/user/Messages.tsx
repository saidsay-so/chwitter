import { useOutletContext } from "react-router-dom";
import MessagesList from "../../components/MessagesList";
import { useAuth } from "../../providers/AuthProvider";
import { getMessages } from "../../services/message";
import { useAsyncEffect, useMessagesReducer } from "../../utils/extra-hooks";
import { UserProfileOutletContext } from "../UserProfile";

const UserMessages = () => {
  const { uid } = useOutletContext<UserProfileOutletContext>();
  const { id: mainUid } = useAuth().user!;
  // const [isPending, startTransition] = useTransition();
  const [
    messages,
    { load, like, removeMessage, unlike, addFriend, removeFriend },
  ] = useMessagesReducer();

  useAsyncEffect(
    async (stillMounted) => {
      const messages = await getMessages({ uid });

      if (stillMounted()) {
        load(messages);
      }
    },
    [uid]
  );

  return (
    <div className="messages-container">
      <MessagesList
        messages={messages}
        friendActions={{ add: addFriend, remove: removeFriend }}
        likeActions={{ like, unlike }}
        removeAction={removeMessage}
        uid={mainUid}
      />
    </div>
  );
};

export default UserMessages;
