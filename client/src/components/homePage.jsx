import "./homePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigator = useNavigate();
  const onClickCreateDoc = () => {
    fetch("http://localhost:4001")
      .then((res) => res.json())
      .then((data) => navigator(`/${data.docId}`));
  };

  return (
    <div className="home-container">
      <button className="create-doc-btn" onClick={onClickCreateDoc}>
        Create New Doc
      </button>
    </div>
  );
};

export default HomePage;
