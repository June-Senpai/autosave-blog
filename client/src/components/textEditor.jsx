import "./textEditor.css";
import Quill from "quill";
import { useCallback } from "react";
import "quill/dist/quill.snow.css";

const TextEditor = () => {
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const quill = new Quill(editor, { theme: "snow" });
    quill.on("text-change", (delta, oldDelta, source) => {
      console.log({ delta, oldDelta, source });
    });
  }, []);

  return (
    <div className="container" ref={wrapperRef}>
      hi
    </div>
  );
};

export default TextEditor;
