import "./textEditor.css";
import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Delta from "quill-delta";
import { useNavigate } from "react-router-dom";

const TextEditor = () => {
  const [docName, setDocName] = useState("Untitled");
  const [docData, setDocData] = useState();
  const navigator = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4001${window.location.pathname}`)
      .then((res) => res?.json())
      .then((data) => {
        if (data?.msg === "Created") {
          return;
        }
        setDocData(data?.data);
        setDocName(data?.docName);
      });
  }, []);

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const quill = new Quill(editor, { theme: "snow" });
      quill.updateContents(new Delta(docData));
      quill.on("text-change", (delta, oldDelta, source) => {
        // console.log({ delta, oldDelta, source });
        fetch(`http://localhost:4001${window.location.pathname}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            delta,
            oldDelta,
            source,
          }),
        });
      });
    },
    [docData]
  );

  const onDeleteDoc = () => {
    fetch(`http://localhost:4001${window.location.pathname}/delete`, {
      method: "DELETE",
    });
    navigator("/");
  };

  const onRenameDoc = () => {
    fetch(`http://localhost:4001${window.location.pathname}/rename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docName,
      }),
    });
  };

  return (
    <>
      <div className="title-bar">
        <input
          type="text"
          placeholder="Untitled"
          onBlur={onRenameDoc}
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
        />
      </div>
      <div className="container" ref={wrapperRef}></div>
      <button className="delete" onClick={onDeleteDoc}>
        Delete
      </button>
    </>
  );
};

export default TextEditor;
