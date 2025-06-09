import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Navbar from "./components/Auth/Navbar";
import { getCurrentUser } from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  //Authentication handlers
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  //Fileupload handlers
  const handleUpload = (uploadedFiles) => {
    setFiles([...files, ...uploadedFiles]);
    console.log("Files ready for upload:", uploadedFiles);
  };

  const handleRemove = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    // <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="app-main">
          <Routes>
            <Route
              path="/login"
              element={
                user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Register onRegister={handleRegister} />
                )
              }
            />
            <Route
              path="/"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : (
                  <>
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
                  </>
                )
              }
            />
          </Routes>
        </main>
      </div>
  );
};

export default App;
