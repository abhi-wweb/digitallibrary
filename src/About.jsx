import React from "react";
import "./About.css";
import AbhishekImg from "./assets/abhi.png";
import PavanImg from "./assets/pvn.jpg";
import ParmeshwarImg from "./assets/parm.jpg";

export default function About() {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Digital Library</h1>
        <p>
          Our platform empowers students to access and share notes, e-books,
          and study materials anytime, anywhere.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="about-mv">
        <div className="mv-item">
          <h2>Our Mission</h2>
          <p>
            To make learning collaborative and accessible for every student,
            breaking barriers of time and location.
          </p>
        </div>
        <div className="mv-item">
          <h2>Our Vision</h2>
          <p>
            To create a global digital learning hub where knowledge is freely
            shared and easily accessible.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
  <h2>Meet Our Team</h2>
  <div className="team-cards">
    <div className="team-card">
      <img src={AbhishekImg} alt="Abhishek" className="avatar-img" />
      <h3>Abhishek Wankhade</h3>
      <p>Founder & BackEnd Developer </p>
    </div>
    <div className="team-card">
      <img src={PavanImg} alt="Pavan" className="avatar-img" />
      <h3>Pavan Sapkal</h3>
      <p>FrontEnd Developer</p>
    </div>
    <div className="team-card">
      <img src={ParmeshwarImg} alt="Parmeshwar" className="avatar-img" />
      <h3>Parmeshwar Hingne</h3>
      <p>UI/UX Designer</p>
    </div>
  </div>
</section>
    </div>
  );
}
