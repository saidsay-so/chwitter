import { MessagesSearchParams } from "common";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Trans } from "@lingui/macro";

import MessagesList from "../components/MessagesList";
import { useAuth } from "../providers/AuthProvider";
import { getMessages } from "../services/message";
import { useService, useMessagesReducer } from "../utils/extra-hooks";
import "./Search.css";

export default function Search() {
  const { id: mainUid } = useAuth().user!;
  const [pageParams, setSearchParams] = useSearchParams();
  const [
    messages,
    { load, addFriend, removeFriend, like, unlike, removeMessage },
  ] = useMessagesReducer();
  const [customParams, setCustomParams] = useState<MessagesSearchParams>({});

  useEffect(() => {
    setCustomParams((params) => ({
      ...params,
      ...Object.fromEntries(pageParams),
    }));
  }, [pageParams]);

  useEffect(() => {
    const searchParams = {
      ...customParams,
    };

    setSearchParams(
      new URLSearchParams(
        Object.entries(searchParams).filter(
          ([, val]) => typeof val === "string"
        )
      )
    );
  }, [customParams]);

  useService(getMessages.bind(null, { ...customParams }), load, [customParams]);

  return (
    <div className="responsive-container">
      <div className="search-page">
        <aside className="search-params-container">
          <h2 className="search-params-title">
            <Trans>Paramètres de recherche</Trans>
          </h2>
          <div>
            <label htmlFor="followed">
              <Trans>Seulement les amis</Trans>
            </label>
            <input
              name="followed"
              type="checkbox"
              onChange={(e) =>
                setCustomParams(({ onlyfollowed, ...params }) => ({
                  ...params,
                  onlyfollowed: onlyfollowed ? undefined : e.target.value,
                }))
              }
              value="true"
              checked={customParams.onlyfollowed !== undefined}
            />
          </div>
        </aside>
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
    </div>
  );
}
