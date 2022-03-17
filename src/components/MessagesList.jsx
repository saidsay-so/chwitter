import PropTypes from "prop-types";
import Message from "./Message";
import "./MessagesList.css";

const MessagesList = ({ messages, friendAction }) => (
  <section>
    <ul className="messages">
      {messages.map((msg) => (
        <li key={msg.id}>
          <Message {...msg} action={friendAction.bind(msg.authorId)} />
        </li>
      ))}
    </ul>
  </section>
);

export default MessagesList;

MessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
};
