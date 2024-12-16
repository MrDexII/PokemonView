import React, { useState } from "react";
import styles from "../style/ChatStyle.module.css";

export default function Chat({ chatMessagePayload, sendMessage }) {
  const [message, setMessage] = useState("");

  const handleMessageChange = ({ target }) => {
    setMessage(target.value);
  };
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.length !== 0 && message !== null && message !== undefined) {
      sendMessage("/app/chat.sendMessage", "message", message);
      setMessage("");
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello to chat</h1>
      <ul className={styles.unOrderList}>
        {chatMessagePayload &&
          chatMessagePayload.map((chatLine, index) => {
            return (
              <li
                key={index}
                className={`${
                  chatLine.type === "NewUser" || chatLine.type === "Leave"
                    ? styles.chatServerMessage
                    : styles.newChatMessage
                }`}
              >
                {chatLine.type === "NewUser" ? (
                  `Welcome to chat ${chatLine.sender}`
                ) : chatLine.type === "Leave" ? (
                  `User ${chatLine.sender} live chat`
                ) : (
                  <>
                    <b
                      style={{
                        color: `rgb(${chatLine.color.red},${chatLine.color.green},${chatLine.color.blue})`,
                      }}
                    >
                      {chatLine.sender}
                    </b>{" "}
                    : {chatLine.content}
                  </>
                )}
              </li>
            );
          })}
      </ul>
      <form
        className={styles.sendMessageContainer}
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          name="message"
          value={message}
          className={styles.message}
          onChange={handleMessageChange}
          autoComplete="off"
        />
        <button className={styles.submitMessageButton}>Send</button>
      </form>
    </div>
  );
}
