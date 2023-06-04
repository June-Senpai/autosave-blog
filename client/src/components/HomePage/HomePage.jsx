import { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const HomePage = () => {
  const [docData, setDocData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}`)
      .then((res) => res.json())
      .then((data) => {
        //docData contains docId and docName
        setDocData(data?.docData);
      });
  }, []);

  const onClickCreateDoc = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/create`)
      .then((res) => res.json())
      .then((data) => navigator(`/${data.docId}`));
  };

  const onClickDocId = (docId) => {
    navigator(`/${docId}`);
  };

  const onDeleteDoc = (docId) => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/${docId}/delete`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        // acknowledged is true if doc is deleted
        if (data?.acknowledged) {
          setDocData(docData.filter((doc) => doc.docId !== docId));
          setIsLoading(false);
        }
      });
    navigator("/");
  };

  return (
    <div className="home-container">
      <button className="create-doc-btn" onClick={onClickCreateDoc}>
        Create New Doc
      </button>
      <div className="recent-docs">
        <div className="recent-docs-header">
          <h2>Recent Docs:</h2>
          <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
          </svg>
        </div>
        <div className="recent-docs-container">
          <div>
            <ul>
              {docData.map(({ docId, docName = null }) => (
                <li className="doc-list-item" key={docId}>
                  {/* show docName if it is not null or Untitled  */}
                  {docName === "Untitled" || docName === null ? docId : docName}
                  <div className="doc-list-item-btns">
                    <button
                      className="doc-item-action-btn open-doc-btn"
                      onClick={() => onClickDocId(docId)}
                    >
                      Open
                    </button>
                    <button
                      className="doc-item-action-btn delete-doc-btn"
                      onClick={() => onDeleteDoc(docId)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {isLoading ? <Loader size={10} hasOverlay={true} /> : null}
    </div>
  );
};

export default HomePage;
