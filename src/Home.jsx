import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [featuredFiles, setFeaturedFiles] = useState([]);

  // Fetch latest 3 uploaded files from backend
  const fetchFeaturedFiles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/files");
      // Show latest 3 files
      setFeaturedFiles(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch featured files", err);
    }
  };

  useEffect(() => {
    fetchFeaturedFiles();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to the Digital Library</h1>
        <p>Access notes, e-books, and study materials anytime, anywhere.</p>
        <button className="hero-btn" onClick={() => navigate("/library")}>
          Explore Now
        </button>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>What We Offer</h2>
        <div className="cards">
          <div className="card">
            <h3>E-Books</h3>
            <p>Read thousands of e-books online or offline at your convenience.</p>
          </div>
          <div className="card">
            <h3>Notes & Summaries</h3>
            <p>Get well-structured notes and summaries for quick learning.</p>
          </div>
          <div className="card">
            <h3>Study Materials</h3>
            <p>Access past papers, guides, and reference materials easily.</p>
          </div>
        </div>
      </section>

      {/* Featured Files Section */}
      {/* <section className="featured">
        <h2>Latest Uploads</h2>
        <div className="featured-files">
          {featuredFiles.length === 0 && <p>No files uploaded yet.</p>}
          {featuredFiles.map((file) => (
            <div
              className="featured-card"
              key={file.id}
              onClick={() => window.open(`http://localhost:3000${file.url}`, "_blank")}
            >
              <h4>{file.name}</h4>
              {file.name.endsWith(".pdf") ? (
                <iframe
                  src={`http://localhost:3000${file.url}`}
                  width="150"
                  height="200"
                  title={file.name}
                />
              ) : (
                <p>Click to view</p>
              )}
            </div>
          ))}
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="cta">
        <h2>Start Your Learning Journey Today!</h2>
        <button className="cta-btn" onClick={() => navigate("/upload")}>
          Upload Files
        </button>
      </section>
    </div>
  );
}
