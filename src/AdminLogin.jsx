// AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";

const API = "http://127.0.0.1:3000";

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await axios.post(`${API}/admin/login`, {
        username,
        password,
      });

      if (res.data.message === "Login successful") {
        localStorage.setItem("adminLoggedIn", "true");
        onLoginSuccess();
      } else {
        setLoginError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {loginError && <p className="error-text">{loginError}</p>}
      </form>
    </div>
  );
}
