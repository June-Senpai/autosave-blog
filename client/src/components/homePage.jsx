import { useEffect, useState } from "react";
import "./homePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [docIds, setDocIds] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4001/")
      .then((res) => res.json())
      .then((data) => setDocIds(data?.docIds));
  }, []);

  const onClickCreateDoc = () => {
    fetch("http://localhost:4001/create")
      .then((res) => res.json())
      .then((data) => navigator(`/${data.docId}`));
  };

  const onClickDocId = (docId) => {
    navigator(`/${docId}`);
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
              {docIds.map((docId) => (
                <li
                  className="doc-list-item"
                  onClick={() => onClickDocId(docId)}
                  key={docId}
                >
                  {docId}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
