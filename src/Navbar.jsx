import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "./assets/OIP (2).webp";
import "./Navbar.css";

const API = "http://127.0.0.1:3000";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setLoggedInUser(JSON.parse(userData));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedInUser(null);
    alert("Logged out successfully!");
    window.location.href = "/";
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("⚠️ Please enter email and password.");
      return;
    }

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`${API}${endpoint}`, { email, password });

      const { user, token } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setMessage(`✅ ${isLogin ? "Logged in" : "Account created"} successfully!`);

      setTimeout(() => {
        setShowPopup(false);
        setEmail("");
        setPassword("");
        setMessage("");
        setLoggedInUser(user);
        window.location.href = "/profile";
      }, 1000);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        (isLogin ? "Login failed!" : "Signup failed!");
      setMessage(`❌ ${errMsg}`);
    }
  };

  return (
    <>
      <nav className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <img src={logo} alt="FreeWay Study Logo" className="logo-img" />
          <h2>FreeWay Study</h2>
        </div>

        {/* Hamburger */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/upload">Upload</a></li>

          {/* 📚 Library Dropdown */}
       <li className="dropdown">
  <a href="/library" className="dropdown-title">
    Library ▾
  </a>

  <ul className="dropdown-menu">

    {/* 🔎 Search Box */}
    <li className="search-box">
      <input
        type="text"
        placeholder="Search course..."
        className="library-search"
        onChange={(e) => {
          const filter = e.target.value.toLowerCase();
          const items = document.querySelectorAll(".dropdown-menu li.course-item");

          items.forEach((item) => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(filter) ? "block" : "none";
          });
        }}
      />
    </li>

    {/* 🎓 Undergraduate Courses */}
    <li className="course-item"><a href="/library/bba">BBA</a></li>
    <li className="course-item"><a href="/library/bca">BCA</a></li>
    <li className="course-item"><a href="/library/bcom">B.Com</a></li>
    <li className="course-item"><a href="/library/ba">BA</a></li>
    <li className="course-item"><a href="/library/bsc">B.Sc</a></li>
    <li className="course-item"><a href="/library/bed">B.Ed</a></li>
    <li className="course-item"><a href="/library/btech">B.Tech</a></li>
    <li className="course-item"><a href="/library/llb">LLB</a></li>
    <li className="course-item"><a href="/library/bpharma">B.Pharma</a></li>
    <li className="course-item"><a href="/library/bba-llb">BBA LLB</a></li>

    {/* 🎓 Postgraduate Courses */}
    <li className="course-item"><a href="/library/mca">MCA</a></li>
    <li className="course-item"><a href="/library/mba">MBA</a></li>
    <li className="course-item"><a href="/library/mcom">M.Com</a></li>
    <li className="course-item"><a href="/library/ma">MA</a></li>
    <li className="course-item"><a href="/library/msc">M.Sc</a></li>
    <li className="course-item"><a href="/library/mtech">M.Tech</a></li>
    <li className="course-item"><a href="/library/llm">LLM</a></li>

  </ul>
</li>
          <li><a href="/assistant">AI Assistant</a></li>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>

        {/* Right Side */}
        <div className="nav-actions">
          {loggedInUser ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="signup-btn" onClick={() => setShowPopup(true)}>
              Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* 🔐 Login/Signup Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleAuth}>
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

              <div className="admin-btn-group">
                <button type="submit" className="popup-btn">
                  {isLogin ? "Login" : "Create Account"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowPopup(false);
                    setEmail("");
                    setPassword("");
                    setMessage("");
                  }}
                >
                  Cancle
                </button>
              </div>
            </form>

            {message && <p className="auth-msg">{message}</p>}

            <p className="toggle-auth">
              {isLogin ? "No account?" : "Already have an account?"}{" "}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
