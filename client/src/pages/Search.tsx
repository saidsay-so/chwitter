import { MessagesSearchParams } from "common";
import { useSearchParams } from "react-router-dom";
import MessagesList from "../components/MessagesList";
import { useAuth } from "../providers/AuthProvider";
import { getMessages } from "../services/message";
import { useAsyncEffect, useMessagesReducer } from "../utils/extra-hooks";

const Search = () => {
  const { id: mainUid } = useAuth().user!;
  const [params, setSearchParams] = useSearchParams();
  const [
    messages,
    { load, addFriend, removeFriend, like, unlike, removeMessage },
  ] = useMessagesReducer();

  useAsyncEffect(
    async (stillMounted) => {
      const searchParams = { ...params };
      const messages = await getMessages(searchParams as MessagesSearchParams);
      if (stillMounted()) {
        load(messages);
      }
    },
    [params]
  );

  return (
    <div className="search-page">
      <section className="search-messages">
        <MessagesList
          uid={mainUid}
          messages={messages}
          friendActions={{ add: addFriend, remove: removeFriend }}
          likeActions={{ like, unlike }}
          removeAction={removeMessage}
        />
      </section>
    </div>
  );
};

export default Search;
