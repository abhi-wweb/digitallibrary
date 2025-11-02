import React, { useState } from "react";
import axios from "axios";
import "./Upload.css";

const API = "http://127.0.0.1:3000";

export default function Upload({ fetchFiles }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Auth state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ---------------- AUTH ----------------
  const handleAuth = async () => {
    if (!email || !password) {
      setMessage("⚠️ Please enter email and password.");
      return;
    }
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`${API}${endpoint}`, { email, password });
      const userData = res.data.user;
      const jwt = res.data.token;

      setUser(userData);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(userData));
      setMessage(`✅ ${isLogin ? "Logged in" : "Account created"} successfully!`);
      setShowPopup(false);
    } catch (err) {
      console.error("Auth error:", err);
      const errMsg =
        err.response?.data?.error || (isLogin ? "Login failed!" : "Signup failed!");
      setMessage(`❌ ${errMsg}`);
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleUploadClick = () => {
    if (!user) {
      setShowPopup(true);
      return;
    }
    document.getElementById("fileInput").click();
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!file) return setMessage("⚠️ Please select a file first.");
    if (!token) return setMessage("⚠️ Please log in before uploading.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`✅ File "${res.data.name}" uploaded successfully!`);
      setFile(null);
      fetchFiles?.();
    } catch (err) {
      console.error("Upload error:", err);
      const errMsg = err.response?.data?.error || "Upload failed!";
      setMessage(`❌ ${errMsg}`);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="upload-page">
      {/* 🌟 Hero Section */}
      <section className="upload-hero">
        <div className="hero-content">
          <h1>Upload Your Study Materials</h1>
          <p>
            Share notes, e-books, and PDFs with the community — make learning accessible for everyone.
          </p>
          <button className="hero-btn" onClick={handleUploadClick}>
            Get Started
          </button>
        </div>
      </section>

      {/* 📤 Upload Card */}
      <div className="upload">
        <div className="upload-card">
          {user ? (
            <>
              <h1>Upload Resources</h1>
              <p>
                Welcome, <strong>{user.email}</strong>
              </p>
              <p>Add notes, e-books, or other study materials easily.</p>

              <button className="upload-btn" onClick={handleUploadClick}>
                {file ? "Change File" : "Choose File"}
              </button>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              {file && <p className="selected-file">📂 Selected: {file.name}</p>}

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!file}
              >
                Upload
              </button>
            </>
          ) : (
            <>
              <h1>Upload Resources</h1>
              <button className="upload-btn" onClick={handleUploadClick}>
                Choose File
              </button>
            </>
          )}
          {message && <p className="upload-msg">{message}</p>}
        </div>
      </div>

      {/* 🔐 Auth Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleAuth}>
              {isLogin ? "Login" : "Create Account"}
            </button>
            <p className="toggle-auth">
              {isLogin ? "No account?" : "Already have an account?"}{" "}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="popup-close-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
