import SimpleButton from "./SimpleButton";
import "./MessageArea.css";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Champ de saisie du message
 */
const MessageArea = ({ id, onSubmit, refArea }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="message-area-container">
      <form
        className="message-area-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            onSubmit(message);
            setMessage("");
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <textarea
          id={id}
          ref={refArea}
          name="message"
          className="message-area"
          placeholder="Écrire un message..."
          onInput={(e) => setMessage(e.target.value)}
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

MessageArea.propTypes = {
  /**
   * ID pour l'ancre
   */
  id: PropTypes.string,
  /**
   * Appelé lors de la soumission du message
   * @param {string} message
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Objet ref
   */
  ref: PropTypes.any.isRequired,
};
