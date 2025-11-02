import React, { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    alert("Logged out successfully!");
    window.location.href = "/";
  };

  return (
    <div className="profile">
      <h1>My Profile</h1>

      {user ? (
        <div className="profile-card">
          <div className="avatar">{user.email[0].toUpperCase()}</div>

          <h2>{user.email.split("@")[0]}</h2>
          <p>Email: {user.email}</p>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <a href="/" className="back-home">🏠 Back to Home</a>
        </div>
      ) : (
        <p className="no-user">⚠️ Please log in to view your profile.</p>
      )}
    </div>
  );
}
