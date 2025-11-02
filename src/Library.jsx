import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Library.css";

const API = "http://127.0.0.1:3000";

export default function Library() {
  const [files, setFiles] = useState([]);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const canvasRefs = useRef({});
  const containerRefs = useRef({});
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.min.js";
    script.onload = () => {
      if (window.pdfjsLib) {
        setPdfjsLib(window.pdfjsLib);
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js";
      }
    };
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (showAuthPopup) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }, [showAuthPopup]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/files`);
        setFiles(res.data || []);
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    })();
  }, []);

  const handlePDFClick = (fileUrl) => {
    if (!token) setShowAuthPopup(true);
    else window.open(`${API}${fileUrl}`, "_blank");
  };

  const handleAuth = async () => {
    if (!email || !password) return setAuthMessage("⚠️ Please enter email and password.");
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`${API}${endpoint}`, { email, password });
      const { user, token } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setToken(token);
      setAuthMessage(`✅ ${isLogin ? "Logged in" : "Account created"} successfully!`);
      setTimeout(() => setShowAuthPopup(false), 1200);
    } catch (err) {
      setAuthMessage(`❌ ${err.response?.data?.error || "Authentication failed!"}`);
    }
  };

  useEffect(() => {
    if (!pdfjsLib || files.length === 0) return;
    files.forEach(async (file) => {
      if (file.name.toLowerCase().endsWith(".pdf")) {
        try {
          const loadingTask = pdfjsLib.getDocument(`${API}${file.url}`);
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });
          const offscreen = document.createElement("canvas");
          offscreen.width = viewport.width;
          offscreen.height = viewport.height;
          const ctx = offscreen.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          const canvas = canvasRefs.current[file.id];
          const container = containerRefs.current[file.id];
          if (!canvas || !container) return;
          const ratio = Math.min(
            (container.clientWidth * 0.9) / offscreen.width,
            (container.clientHeight * 0.9) / offscreen.height,
            1
          );
          canvas.width = offscreen.width * ratio;
          canvas.height = offscreen.height * ratio;
          canvas.getContext("2d").drawImage(offscreen, 0, 0, canvas.width, canvas.height);
        } catch (err) {
          console.error("Thumbnail error:", err);
        }
      }
    });
  }, [files, pdfjsLib]);

  const scrollToLibrary = () => {
    document.getElementById("library-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="library">
      {/* 🌟 Hero Section */}
      <section className="library-hero">
        <div className="hero-content">
          <h1>📚 Explore Our Digital Library</h1>
          <p>
            Access hundreds of professional notes, resources, and books to boost your learning.
          </p>
          <button className="hero-btn" onClick={scrollToLibrary}>
            Browse Library
          </button>
        </div>
      </section>

      {/* 📚 Library Section */}
      <div id="library-grid" className="library-grid">
        {files.map((file, index) => (
          <div
            key={file.id}
            className={`book-card theme-${index % 3}`}
            ref={(el) => (containerRefs.current[file.id] = el)}
          >
            <div
              className="book-header"
              title="Click to open PDF"
              onClick={() => handlePDFClick(file.url)}
            >
              <div className="book-title">{file.name.replace(".pdf", "")}</div>
              <div className="book-sub">Notes for Professionals</div>
            </div>

            <div
              className="book-preview"
              onClick={() => handlePDFClick(file.url)}
              style={{ cursor: "pointer" }}
            >
              <canvas
                className="thumb-canvas"
                ref={(el) => (canvasRefs.current[file.id] = el)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🔐 Auth Popup */}
      {showAuthPopup && (
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
            <button className="popup-btn" onClick={handleAuth}>
              {isLogin ? "Login" : "Create Account"}
            </button>
            <p className="toggle-auth">
              {isLogin ? "No account?" : "Already have an account?"}{" "}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
            {authMessage && <p className="auth-msg">{authMessage}</p>}
            <button className="popup-close" onClick={() => setShowAuthPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
