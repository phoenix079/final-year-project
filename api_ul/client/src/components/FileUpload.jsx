// src/components/FileUpload.jsx
import axios from "axios";
import React, { useCallback, useState } from "react";
import FilePreview from "./FilePreview";
import FileUploadProgress from "./FileUploadProgress";

const FileUpload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(
      (file) => file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  //newly added axios
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);

    const file = selectedFiles[0]; // Take the first file
    const formData = new FormData();
    formData.append("file", file); // Single file with key "file"

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).token
                : ""
            }`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [0]: progress }));
          },
        }
      );

      onUpload([response.data.file]); // Update parent state with uploaded file
      setSelectedFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert(
        `Failed to upload file: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // const simulateUpload = () => {
  //   if (selectedFiles.length === 0) return;

  //   setIsUploading(true);
  //   const newProgress = {};

  //   selectedFiles.forEach((file, index) => {
  //     newProgress[index] = 0;
  //     // Simulate upload progress
  //     const interval = setInterval(() => {
  //       setUploadProgress((prev) => {
  //         const newValue = prev[index] + Math.random() * 10;
  //         if (newValue >= 100) {
  //           clearInterval(interval);
  //           return { ...prev, [index]: 100 };
  //         }
  //         return { ...prev, [index]: newValue };
  //       });
  //     }, 200);
  //   });

  //   // Simulate completion after 3 seconds
  //   setTimeout(() => {
  //     onUpload(selectedFiles);
  //     setSelectedFiles([]);
  //     setUploadProgress({});
  //     setIsUploading(false);
  //   }, 3000);
  // };

  return (
    <div
      className={`file-upload-container ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="upload-area">
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleChange}
          className="file-input"
        />
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h3>Drag & Drop files here</h3>
          <p>or click to browse</p>
          <p className="file-types">Supports: JPEG, JPG, PNG,(Max 10MB)</p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h4>Selected Files ({selectedFiles.length})</h4>
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <FilePreview file={file} />
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {uploadProgress[index] !== undefined ? (
                    <FileUploadProgress progress={uploadProgress[index]} />
                  ) : (
                    <button
                      onClick={() => removeFile(index)}
                      className="remove-file-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={uploadFiles}
            disabled={isUploading}
            className="upload-button"
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
