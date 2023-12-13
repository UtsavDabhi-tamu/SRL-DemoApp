import React from "react";
import { FaPencilAlt, FaEraser } from "react-icons/fa";

function Toolbar({ togglePencil, toggleEraser }) {
  return (
    <div style={{ margin: "1% 20%", textAlign: "center" }}>
      <button className="edit-btn" onClick={togglePencil}>
        <FaPencilAlt style={{ fontSize: "24px" }} />
      </button>
      <button className="edit-btn" onClick={toggleEraser}>
        <FaEraser style={{ fontSize: "24px" }} />
      </button>
    </div>
  );
}

export default Toolbar;
