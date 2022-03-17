import { getMessages } from "../services/messages";
import MessagesList from "../components/MessagesList";
import "./HomeFeed.css";
import MessageArea from "../components/MessageArea";

export default function HomeFeed({}) {
  const messages = getMessages(null);

  return (
    <div className="home-feed">
      <h1>Accueil</h1>
      <MessageArea />
      <MessagesList messages={messages} friendAction={console.log} />
    </div>
  );
}
