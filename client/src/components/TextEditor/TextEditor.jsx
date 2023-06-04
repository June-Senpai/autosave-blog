import "./TextEditor.css";
import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Delta from "quill-delta";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../utils/utils";
import DocumentTitle from "../DocumentTitle/DocumentTitle";
import { useRef } from "react";

const TextEditor = () => {
  const [docData, setDocData] = useState();
  const loadingSetterRef = useRef();

  const setIsLoading = loadingSetterRef?.current?.setIsLoading;

  const navigator = useNavigate();

  // console.log({ loadingSetterRef, setIsLoading });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}${window.location.pathname}`)
      .then((res) => res?.json())
      .then((data) => {
        // if it's a newly created document, then return without setting previous data
        if (data?.msg === "Created") {
          return;
        }
        setDocData(data);
      });
  }, []);

  const onUpdateDoc = async (delta, oldDelta, source) => {
    setIsLoading?.(true);
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${window.location.pathname}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delta,
          oldDelta,
          source,
        }),
      }
    );
    setIsLoading?.(false);
  };

  const debouncedUpdateDoc = debounce(onUpdateDoc, 300);

  const onDeleteDoc = async () => {
    setIsLoading?.(true);
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${window.location.pathname}/delete`,
      {
        method: "DELETE",
      }
    );
    setIsLoading?.(false);
    navigator("/");
  };

  const onRenameDoc = async (docName) => {
    setIsLoading?.(true);
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${window.location.pathname}/rename`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docName,
        }),
      }
    );
    setIsLoading?.(false);
  };

  // setting up quill editor
  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const quill = new Quill(editor, { theme: "snow" });
      quill.updateContents(new Delta(docData?.data));
      quill.on("text-change", debouncedUpdateDoc);
    },
    [docData, debouncedUpdateDoc]
  );

  return (
    <>
      <div className="title-bar">
        <DocumentTitle
          docTitle={docData?.docName}
          onRenameDoc={onRenameDoc}
          loadingSetterRef={loadingSetterRef}
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
