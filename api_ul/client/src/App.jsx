import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);

  const handleUpload = (uploadedFiles) => {
    setFiles([...files, ...uploadedFiles]);
    // Here you would typically send files to your backend
    console.log("Files ready for upload:", uploadedFiles);
  };

  const handleRemove = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>File Upload Center</h1>
        <p>Upload your documents, images, or any files</p>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <FileUpload onUpload={handleUpload} />
        </div>

        {files.length > 0 && (
          <div className="files-list">
            <h3>Uploaded Files</h3>
            <div className="file-previews">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemove(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2023 File Upload App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
