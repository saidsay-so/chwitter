import PropTypes from "prop-types";
import Message from "./Message";
import "./MessagesList.css";

const MessagesList = ({ messages, friendAction, isFriend, fromHimself }) => {
  return (
    <ul className="messages">
      {messages.map((msg) => (
        <li key={msg.id}>
          <Message
            {...msg}
            fromHimself={fromHimself}
            isFriend={isFriend}
            action={friendAction.bind(null, msg.authorId)}
          />
        </li>
      ))}
    </ul>
  );
};

export default MessagesList;

MessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  friendAction: PropTypes.func.isRequired,
  isFriend: PropTypes.bool,
  fromHimself: PropTypes.bool,
  mainUid: PropTypes.string,
};
