import SimpleButton from "./SimpleButton";
import "./MessageArea.css";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { MutableRefObject, useState } from "react";

interface MessageAreaProps {
  /**
   * ID pour l'ancre
   */
  id: string;
  /**
   * Appelé lors de la soumission du message
   * @param {string} message Message
   */
  onSubmit: (message: string) => void;
  /**
   * Objet ref pour accéder directement à l'élément sous-jacent
   */
  refArea: MutableRefObject<HTMLTextAreaElement>;
}

/**
 * Champ de saisie du message
 */
const MessageArea = ({ id, onSubmit, refArea }: MessageAreaProps) => {
  const [message, setMessage] = useState("");

  return (
    <div className="message-area-container">
      <form
        className="message-area-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(message);
          setMessage("");
        }}
      >
        <textarea
          id={id}
          ref={refArea}
          minLength={8}
          name="message"
          className="message-area"
          placeholder="Écrire un message..."
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          required
          autoFocus
          value={message}
        ></textarea>
        <SimpleButton
          round
          label={
            <IconContext.Provider
              value={{
                style: {},
              }}
            >
              <RiSendPlane2Fill />
            </IconContext.Provider>
          }
        />
      </form>
    </div>
  );
};

export default MessageArea;
