import React from "react";
import styles from "../style/OpponentsListViewStyle.module.css";
export default function OpponentsListView({
  listOfUsers,
  username,
  stompClient,
}) {
  const handleConnectToUser = (event, sessionId) => {
    event.preventDefault();
    stompClient.publish({
      destination: "/app/chat.sendRequestForPlayToUser",
      headers: {},
      body: JSON.stringify({
        sender: username,
        type: "battleRequest",
        content: `${username} wants to play`,
        userSessionId: sessionId,
      }),
    });
  };
  return (
    <div>
      <ul className={styles.list}>
        {listOfUsers
          ? listOfUsers
              .filter((user) => username !== user.username)
              .map((user) => (
                <li key={user.sessionId}>
                  <a
                    href=""
                    onClick={(event) =>
                      handleConnectToUser(event, user.sessionId)
                    }
                  >
                    {user.username}
                  </a>
                </li>
              ))
          : ""}
      </ul>
    </div>
  );
}
