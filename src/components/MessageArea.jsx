import SimpleButton from "./SimpleButton";
import "./MessageArea.css";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { useState } from "react";

export default function MessageArea({ id, onSubmit, refArea }) {
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
          onInput={(e) => {
            setMessage(e.target.value);
          }}
          required
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
}
