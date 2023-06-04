import { useEffect, useImperativeHandle, useState } from "react";
import { PropTypes } from "prop-types";
import "./DocumentTitle.css";
import Loader from "../Loader/Loader";

const DocumentTitle = ({
  docTitle = "Untitled",
  onRenameDoc,
  loadingSetterRef,
}) => {
  const [docName, setDocName] = useState(docTitle);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(loadingSetterRef, () => ({
    setIsLoading,
  }));

  useEffect(() => {
    if (docTitle) {
      setDocName(docTitle);
    }
  }, [docTitle]);

  return (
    <>
      <div className="input-container">
        <input
          type="text"
          onBlur={() => onRenameDoc(docName)}
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
        />
        {isLoading ? <Loader /> : null}
      </div>
    </>
  );
};

DocumentTitle.propTypes = {
  docTitle: PropTypes.string,
  onRenameDoc: PropTypes.func,
  loadingSetterRef: PropTypes.object,
};

export default DocumentTitle;
