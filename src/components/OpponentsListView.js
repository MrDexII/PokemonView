import React from "react";
import styles from "../style/OpponentsListViewStyle.module.css";

export default function OpponentsListView({ message, username,  }) {
  const handleConnectToUser = (event, sessionId) => {
    event.preventDefault();

    console.log(event.target, sessionId);
  };
  return (
    <div>
      <ul className={styles.list}>
        {message.userSessionsList ? (
          message.userSessionsList
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
                </a>{" "}
              </li>
            ))
        ) : (
          <></>
        )}
        {/* <li>
          <a href="" onClick={handleConnectToUser}>
            opponent 1
          </a>
        </li>
        <li>
          <a href="" onClick={handleConnectToUser}>
            opponent 2
          </a>
        </li>

        <li>
          <a href="" onClick={handleConnectToUser}>
            opponent 3
          </a>
        </li>
        <li>
          {" "}
          <a href="" onClick={handleConnectToUser}>
            opponent 4
          </a>
        </li>
        <li>
          {" "}
          <a href="" onClick={handleConnectToUser}>
            opponent 5
          </a>
        </li> */}
      </ul>
    </div>
  );
}
