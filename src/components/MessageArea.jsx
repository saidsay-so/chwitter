import SimpleButton from "./SimpleButton";
import "./MessageArea.css";

export default function MessageArea({}) {
  return (
    <div className="message-area-container">
      <form className="message-area-form">
        <textarea name="message" className="message-area" required></textarea>
      </form>
      <SimpleButton label="Envoyer" />
    </div>
  );
}
