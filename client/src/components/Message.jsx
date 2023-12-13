import React from "react";

function Message({ text, type }) {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        color: type === "error" ? "red" : "green",
      }}
    >
      {text && <p>{text}</p>}
    </div>
  );
}

export default Message;
