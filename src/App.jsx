import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Library from "./Library";
import Upload from "./Upload";
import About from "./About";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin"; // ✅ Import login page
import Profile from "./Profile";
import Chat from "./Chat"; // AI Assistant
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem("adminLoggedIn") === "true"
  );

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Router>
      <Navbar /> {/* Always visible */}
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library files={files} />} />
          <Route path="/library/:course" element={<Library files={files} />} />   
          <Route path="/upload" element={<Upload fetchFiles={fetchFiles} />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assistant" element={<Chat />} />

          {/* Admin Routes */}
          {!isAdminLoggedIn ? (
            <Route
              path="/admin"
              element={
                <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
              }
            />
          ) : (
            <Route path="/admin" element={<Admin />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
