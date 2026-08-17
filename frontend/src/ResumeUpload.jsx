import { useRef, useState } from "react";

const API_BASE_URL = "https://placement-portal-0xsf.onrender.com";

function ResumeUpload({ resume, onResumeChange }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ========================================
  // GET TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem("placeTrackToken");
  };

  // ========================================
  // FRIENDLY FILE NAME
  // ========================================

  const getDisplayFileName = () => {
    if (!resume?.fileName) {
      return "Resume";
    }

    let name = resume.fileName;

    const parts = name.split("_");

    if (parts.length >= 3) {
      parts.shift();
      parts.shift();

      name = parts.join("_");
    }

    return name;
  };

  // ========================================
  // FILE SELECTED
  // ========================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please choose a PDF, DOC, or DOCX file.");
      return;
    }

    // Check file size - 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setError("");
  };

  // ========================================
  // OPEN FILE PICKER
  // ========================================

  const openFilePicker = () => {
    setMessage("");
    setError("");

    fileInputRef.current?.click();
  };

  // ========================================
  // UPLOAD / REPLACE
  // ========================================

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a resume first.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(
        `${API_BASE_URL}/resume/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(
          `Server returned an unexpected response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Resume upload failed."
        );
      }

      // Update parent state immediately
      onResumeChange(data.resume || null);

      // Clear selected file
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(
        resume
          ? "Resume updated successfully!"
          : "Resume uploaded successfully!"
      );
    } catch (err) {
      console.error("Resume upload error:", err);

      setError(
        err.message || "Could not upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  // ========================================
  // DELETE RESUME
  // ========================================

  const handleDelete = async () => {
    const token = getToken();

    if (!token) {
      setError(
        "Your session has expired. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove your resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/resume/delete`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Could not remove resume."
        );
      }

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onResumeChange(null);

      setMessage(
        "Resume removed successfully."
      );
    } catch (err) {
      console.error("Resume delete error:", err);

      setError(
        err.message || "Could not remove resume."
      );
    } finally {
      setUploading(false);
    }
  };

  // ========================================
  // VIEW RESUME
  // ========================================

  const handleViewResume = () => {
    if (!resume?.fileUrl) {
      setError("Resume file is not available.");
      return;
    }

  window.open(
  `${API_BASE_URL}${resume.fileUrl}`,
  "_blank"
);

  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const getUploadDate = () => {
    if (!resume?.uploadedAt) {
      return "";
    }

    const date = new Date(resume.uploadedAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // CHECK IF RESUME EXISTS
  // ========================================

  const hasResume = Boolean(
    resume?.fileName && resume?.fileUrl
  );

  // ========================================
  // UI
  // ========================================

  return (
    <div className="resumeSection">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="resumeHeader">

        <div className="resumeHeaderLeft">

          <div className="resumeIcon">
            📄
          </div>

          <div>
            <h3>Resume</h3>

            <p>
              Keep your latest resume ready
              for placement applications.
            </p>
          </div>

        </div>

        {hasResume && (
          <span className="resumeStatus">
            ✓ Uploaded
          </span>
        )}

      </div>


      {/* ======================================
          HIDDEN FILE INPUT
      ====================================== */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />


      {/* ======================================
          EXISTING RESUME
      ====================================== */}

      {hasResume ? (

        <div className="resumeFileCard">

          <div className="resumeFileIcon">
            📄
          </div>

          <div className="resumeFileInfo">

            <strong>
              {getDisplayFileName()}
            </strong>

            <span>
              Uploaded {getUploadDate()}
            </span>

          </div>

          <div className="resumeActions">

            {/* VIEW */}

            <button
              type="button"
              className="resumeViewButton"
              onClick={handleViewResume}
            >
              👁 View Resume
            </button>


            {/* UPDATE */}

            <button
              type="button"
              className="resumeUpdateButton"
              onClick={openFilePicker}
              disabled={uploading}
            >
              🔄 Update
            </button>


            {/* REMOVE */}

            <button
              type="button"
              className="resumeDeleteButton"
              onClick={handleDelete}
              disabled={uploading}
            >
              🗑 Remove
            </button>

          </div>

        </div>

      ) : (

        /* ======================================
           NO RESUME
        ====================================== */

        <div className="resumeEmpty">

          <div className="resumeEmptyIcon">
            📄
          </div>

          <h3>
            No resume uploaded
          </h3>

          <p>
            Upload your resume once and
            use it for placement applications.
          </p>

          <button
            type="button"
            className="chooseResumeButton"
            onClick={openFilePicker}
            disabled={uploading}
          >
            📁 Choose Resume
          </button>

        </div>

      )}


      {/* ======================================
          SELECTED NEW RESUME
          ONLY APPEARS AFTER CLICKING UPDATE
      ====================================== */}

      {file && (

        <div className="resumeReplaceArea">

          <div className="selectedResume">

            <span>
              📎 {file.name}
            </span>

            <button
              type="button"
              onClick={() => {
                setFile(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              ✕
            </button>

          </div>


          <button
            type="button"
            className="uploadResumeButton"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading
              ? "Replacing..."
              : hasResume
              ? "Replace Resume"
              : "Upload Resume"}
          </button>

        </div>

      )}


      {/* ======================================
          SUCCESS
      ====================================== */}

      {message && (
        <div className="resumeSuccess">
          ✓ {message}
        </div>
      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="resumeError">
          ⚠ {error}
        </div>
      )}


      {/* ======================================
          FILE INFO
      ====================================== */}

      <div className="resumeInfo">

        <span>
          PDF, DOC or DOCX
        </span>

        <span>
          Maximum 5 MB
        </span>

      </div>

    </div>
  );
}

export default ResumeUpload;