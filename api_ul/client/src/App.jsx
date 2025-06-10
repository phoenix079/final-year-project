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


  //NEW LOGOUT HOOK
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  //Fileupload handlers
  const handleUpload = (uploadedFiles) => {
    setFiles([...files, ...uploadedFiles]);
    console.log("Files ready for upload:", uploadedFiles);
  };

  // const handleRemove = (index) => {
  //   const newFiles = [...files];
  //   newFiles.splice(index, 1);
  //   setFiles(newFiles);
  // };

  //this is the new handler for syncing the delete from the server
  // const handleRemove = async (fileId) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     });
  //     setFiles(files.filter((file) => file._id !== fileId));
  //   } catch (error) {
  //     console.error("Error deleting file:", error);
  //   }
  // };

  //newly added hook
  useEffect(() => {
    if (user) {
      const fetchFiles = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/files", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setFiles(response.data);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };
      fetchFiles();
    }
  }, [user]);


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
                  {/* {files.length > 0 && (
                      <div className="files-list">
                        <h3>Uploaded Files</h3>
                        <div className="file-previews">
                          {files.map((file, index) => (
                            <div key={file._id} className="file-item">
                              <span>{file.originalname}</span>
                              <button onClick={() => handleRemove(file._id)} className="remove-btn">
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
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
