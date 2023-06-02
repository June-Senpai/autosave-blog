import "./textEditor.css";
import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Delta from "quill-delta";

const TextEditor = () => {
  const [docData, setDocData] = useState();
  useEffect(() => {
    fetch(`http://localhost:4001${window.location.pathname}`)
      .then((res) => res?.json())
      .then((data) => {
        if (data?.msg === "Created") {
          return;
        }
        setDocData(data);
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

  return (
    <div className="container" ref={wrapperRef}>
      hi
    </div>
  );
};

export default TextEditor;
