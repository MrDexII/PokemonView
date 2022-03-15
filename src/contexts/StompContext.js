import React from "react";

const StompContext = React.createContext({
  contextStompClient: undefined,
  setContextStompClient: () => {},
});

export default StompContext;
