import "./App.css";
import TextEditor from "./components/TextEditor";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:docId" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
