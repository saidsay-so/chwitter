import SimpleButton from "./SimpleButton";
import "./MessageArea.css";
import { RiSendPlane2Fill } from "react-icons/ri";
import { ComponentPropsWithoutRef, MutableRefObject, useState } from "react";
import { t } from "@lingui/macro";

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
  minLength?: number;
  maxLength?: number;
}

/**
 * Champ de saisie du message
 */
const MessageArea = ({
  id,
  onSubmit,
  refArea,
  minLength,
  maxLength,
}: MessageAreaProps) => {
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
          minLength={minLength}
          maxLength={maxLength}
          id={id}
          ref={refArea}
          name="message"
          className="message-area"
          placeholder={t`Écrire un message...`}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          required
          autoFocus
          value={message}
        ></textarea>
        <SimpleButton round label={<RiSendPlane2Fill />} />
      </form>
    </div>
  );
};

export default MessageArea;
