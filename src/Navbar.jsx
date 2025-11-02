import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "./assets/logo.jpg";
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

  // 🔐 Handle login/signup with backend
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
        window.location.href = "/profile"; // ✅ redirect to Profile page
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
        {/* 🌟 Logo + Title */}
       <div className="nav-logo">
  <img src={logo} alt="Notes App Logo" className="logo-img" />
  <h2>FreeWay Study</h2>
</div>


        {/* 🍔 Hamburger Menu */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* 🔗 Navigation Links */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/upload">Upload</a></li>
          <li><a href="/library">Library</a></li>
          <li><a href="/assistant">AI Assistant</a></li>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>

        {/* 🎯 Right Button */}
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

      {/* 🔒 Login/Signup Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
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
              <button type="submit" className="popup-btn">
                {isLogin ? "Login" : "Create Account"}
              </button>
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
