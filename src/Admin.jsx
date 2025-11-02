import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLogin from "./AdminLogin";

import "./Admin.css";

const API = "http://127.0.0.1:3000";

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("adminLoggedIn") === "true"
  );

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API}/files`);
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/login`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLoggedInUsers = async () => {
    try {
      const res = await axios.get(`${API}/users/loggedin`);
      setLoggedInUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch logged-in users", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (err) {
      console.error("Failed to delete file", err);
      alert("❌ Could not delete file.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
      fetchUsers();
      fetchLoggedInUsers();
    }
  }, [isLoggedIn]);

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="files-section">
        {loadingFiles ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>URL</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.id}</td>
                  <td>{file.name}</td>
                  <td>
                    <a
                      href={`${API}${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(file.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
