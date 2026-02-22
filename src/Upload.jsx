import React, { useState } from "react";
import axios from "axios";
import "./Upload.css";

const API = "http://127.0.0.1:3000";

export default function Upload({ fetchFiles }) {
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
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

  /* ================= COURSE LIST ================= */

  const courses = [
    { value: "ba", label: "B.A." },
    { value: "bsc", label: "B.Sc." },
    { value: "bcom", label: "B.Com" },
    { value: "bba", label: "BBA" },
    { value: "bca", label: "BCA" },
    { value: "btech", label: "B.Tech" },
    { value: "be", label: "B.E." },
    { value: "mtech", label: "M.Tech" },
    { value: "mca", label: "MCA" },
    { value: "mba", label: "MBA" },
    { value: "mbbs", label: "MBBS" },
    { value: "llb", label: "LLB" },
    { value: "llm", label: "LLM" },
    { value: "msc", label: "M.Sc." },
    { value: "ma", label: "M.A." },
    { value: "mcom", label: "M.Com" },
    { value: "barch", label: "B.Arch" },
    { value: "bed", label: "B.Ed" },
    { value: "phd", label: "Ph.D" }
  ];

  const filteredCourses = courses.filter((c) =>
    c.label.toLowerCase().includes(courseSearch.toLowerCase())
  );

  /* ================= AUTH ================= */

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

      setMessage(
        `✅ ${isLogin ? "Logged in" : "Account created"} successfully!`
      );
      setShowPopup(false);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        (isLogin ? "Login failed!" : "Signup failed!");
      setMessage(`❌ ${errMsg}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    setMessage("👋 Logged out successfully.");
  };

  /* ================= FILE UPLOAD ================= */

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
    if (!course) return setMessage("⚠️ Please select a course.");
    if (!token) return setMessage("⚠️ Please log in before uploading.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", course);

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`✅ File "${res.data.name}" uploaded successfully!`);
      setFile(null);
      setCourse("");
      setCourseSearch("");
      fetchFiles?.();
    } catch (err) {
      const errMsg = err.response?.data?.error || "Upload failed!";
      setMessage(`❌ ${errMsg}`);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="upload-page">
      <section className="upload-hero">
        <div className="hero-content">
          <h1>Upload Your Study Materials</h1>
          <p>
            Share notes, e-books, and PDFs organized by course for better
            accessibility.
          </p>
          <button className="hero-btn" onClick={handleUploadClick}>
            Get Started
          </button>
        </div>
      </section>

      <div className="upload">
        <div className="upload-card">
          <h1>Upload Resources</h1>

          {user ? (
            <>
              <p>
                Welcome, <strong>{user.email}</strong>
              </p>

            

              {/* Course Search */}
              <input
              
                type="text"
                placeholder="🔍 Search Course..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="course-search"
              />

              {/* Course Select */}
              
            <select
  value={course}
  onChange={(e) => setCourse(e.target.value)}
  className="course-select"
>
  <option value="">Select Course</option>
  {filteredCourses.map((c) => (
    <option key={c.value} value={c.value}>
      {c.label}
    </option>
  ))}
</select>

              {/* File Choose */}
              <button className="upload-btn" onClick={handleUploadClick}>
                {file ? "Change File" : "Choose File"}
              </button>

              <input
                type="file"
                id="fileInput"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              {file && (
                <p className="selected-file">📂 Selected: {file.name}</p>
              )}

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!file || !course}
              >
                Upload
              </button>
            </>
          ) : (
            <>
              <p>Please log in to upload study materials.</p>
              <button className="upload-btn" onClick={handleUploadClick}>
                Login to Upload
              </button>
            </>
          )}

          {message && <p className="upload-msg">{message}</p>}
        </div>
      </div>

      {/* AUTH POPUP */}
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