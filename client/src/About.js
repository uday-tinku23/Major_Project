import React from 'react';
import { Link } from 'react-router-dom';
import './about.css';
import logo from './assets/logo.png';
const backgroundImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
// Use placeholder URLs instead

const creators = [
  {
    name: 'Manikanth',
    role: 'Front End Developer',
    image: 'https://placehold.co/120x120?text=Manikanth',
    linkedin: 'https://linkedin.com/in/manikanth',
    email: 'manikanthetikyala174@email.com',
    phone: '+91-6309297589',
  },
  {
    name: 'Karthik',
    role: 'Back End Developer',
    image: 'https://placehold.co/120x120?text=Karthik',
    linkedin: 'https://linkedin.com/in/karthik',
    email: 'kathrojukarthik12@gmail.com',
    phone: '+91-8466055011',
  },
  {
    name: 'Ram-Reddy',
    role: 'Back End Developer',
    image: 'https://placehold.co/120x120?text=Ram',
    linkedin: 'https://linkedin.com/in/ram-reddy',
    email: 'ramreddy9181@gmail.com',
    phone: '+91-9652083960',
  },
];

export default function About() {
  const isLoggedIn = !!localStorage.getItem('user');
  return (
    <div className="about-page">
      {/* Background */}
      <div className="background-container">
        <img src={backgroundImage} alt="Agriculture Technology" className="background-image" />
        <div className="background-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="home-navbar">
        <div className="nav-logo">
          <img src={logo} alt="Crop-era Logo" />
        </div>
        <div className="nav-actions">
          <Link to="/about" className="nav-btn capsule-nav-btn" style={{fontWeight: 'bold'}}>About</Link>
          {!isLoggedIn && (
            <>
              <Link to="/login" className="nav-btn capsule-nav-btn login-btn"><span>Login</span></Link>
              <Link to="/register" className="nav-btn capsule-nav-btn register-btn"><span>Register</span></Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="about-title">About the Creators</h1>
        <div className="creators-list">
          {creators.map((creator, idx) => (
            <div className="creator-card" key={idx}>
              <img src={creator.image} alt={creator.name} className="creator-img" />
              <h2 className="creator-name">{creator.name}</h2>
              <p className="creator-role">{creator.role}</p>
              <div className="creator-links">
                <a href={creator.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={`mailto:${creator.email}`}>{creator.email}</a>
                <a href={`tel:${creator.phone}`}>{creator.phone}</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Crop-era" />
            <p>Bridging Agriculture & Technology</p>
          </div>
          <div className="footer-links">
            {!isLoggedIn && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            <Link to="/weather">Weather</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Crop-era. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 