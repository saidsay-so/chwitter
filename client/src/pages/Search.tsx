import { MessagesSearchParams } from "common";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MessagesList from "../components/MessagesList";
import { useAuth } from "../providers/AuthProvider";
import { getMessages } from "../services/message";
import { useAsyncEffect, useMessagesReducer } from "../utils/extra-hooks";
import "./Search.css";

export default function Search() {
	const { id: mainUid } = useAuth().user!;
	const [pageParams, setSearchParams] = useSearchParams();
	const [
		messages,
		{ load, addFriend, removeFriend, like, unlike, removeMessage },
	] = useMessagesReducer();
	const [customParams, setCustomParams] = useState<MessagesSearchParams>({});

	useAsyncEffect(
		async (stillMounted) => {
			const searchParams = {
				...Object.fromEntries(pageParams),
				...customParams,
			};
			setSearchParams(
				new URLSearchParams(
					Object.entries(searchParams).filter(
						([, val]) => typeof val === "string"
					)
				)
			);
			const messages = await getMessages(searchParams as MessagesSearchParams);

			if (stillMounted()) {
				load(messages);
			}
		},
		[pageParams, customParams]
	);

	return (
		<div className="responsive-container">
			<div className="search-page">
				<aside className="search-params-container">
					<h2 className="search-params-title">Paramètres de recherche</h2>
					<div>
						<label htmlFor="followed">Seulement les amis</label>
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
