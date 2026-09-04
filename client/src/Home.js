import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import logo from './assets/logo.png';
import backgroundImage from './assets/background.png';

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [userCrop, setUserCrop] = useState(null);
  const [userName, setUserName] = useState('');
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  const features = [
    {
      title: 'Smart Agriculture',
      description: 'Revolutionizing farming with AI-powered insights and precision technology',
      icon: '🌾',
    },
    {
      title: 'AI Technology',
      description: 'Advanced machine learning algorithms that adapt to your farming needs',
      icon: '🤖',
    },
    {
      title: 'Data Analytics',
      description: 'Comprehensive insights and recommendations for better decision making',
      icon: '📊',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('user'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserName(user?.displayName || user?.name || '');
      setUserInfo({
        name: user?.displayName || user?.name || '',
        email: user?.email || '',
      });
      fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(users => {
          const found = users.find(u => u.email === user.email);
          if (found && found.crop) setUserCrop(found.crop);
        });
    } else {
      setUserCrop(null);
      setUserName('');
      setUserInfo({ name: '', email: '' });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="homePage">
      <div className="background-container">
        <img src={backgroundImage} alt="Agriculture Technology" className="background-image" />
        <div className="background-overlay"></div>
      </div>
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} id="sidebar-logo" alt="logo" />
          <button className="close-sidebar" onClick={closeSidebar} data-tooltip="Close Menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path fill="#13321e" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-userinfo">
            <div className="sidebar-avatar" aria-label="User avatar">{userInfo.name ? userInfo.name[0].toUpperCase() : <svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="#a5d6a7" /></svg>}</div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-name">{userInfo.name || 'Guest'}</div>
              <div className="sidebar-user-email">{userInfo.email}</div>
              {userCrop && <div className="sidebar-user-crop">Crop: <span>{userCrop}</span></div>}
            </div>
          </div>
          <nav className="sidebar-nav" aria-label="Sidebar navigation">
            <Link to="/" className="sidebar-nav-link" aria-label="Home"><span role="img" aria-label="Home">🏠</span> Home</Link>
            <Link to="/profile" className="sidebar-nav-link" aria-label="Profile"><span role="img" aria-label="Profile">👤</span> Profile</Link>
            <Link to="/about" className="sidebar-nav-link" aria-label="About Creators"><span role="img" aria-label="About">👨‍💻</span> About</Link>
            <Link to="/store" className="sidebar-nav-link" aria-label="Store"><span role="img" aria-label="Store">🛒</span> Store</Link>
            <Link to="/cart" className="sidebar-nav-link" aria-label="Cart"><span role="img" aria-label="Cart">🧺</span> Cart</Link>
            <button className="sidebar-nav-link" aria-label="Logout" onClick={handleLogout} style={{background:'none',border:'none',textAlign:'left',width:'100%',padding:'10px 16px',cursor:'pointer'}}><span role="img" aria-label="Logout">🚪</span> Logout</button>
          </nav>
        </div>
      </div>
      <nav className="home-navbar">
        <div className="nav-logo">
          <img src={logo} alt="Crop-era Logo" />
        </div>
        <div className="nav-actions">
          {/* Hamburger menu for sidebar */}
          <button className="hamburger-menu" onClick={toggleSidebar} data-tooltip="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="#13321e" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
            </svg>
          </button>
          {/* Existing nav actions (hidden on mobile) */}
          {isLoggedIn ? (
            <>
              <Link to="/store" className="nav-btn capsule-nav-btn"><span>Store</span></Link>
              <Link to="/cart" className="nav-btn capsule-nav-btn"><span>Cart</span></Link>
              <Link to="/weather" className="nav-btn capsule-nav-btn"><span>Weather Tracking</span></Link>
              <Link to="/about" className="nav-btn capsule-nav-btn"><span>About Creators</span></Link>
              <Link to="/profile" className="nav-btn capsule-nav-btn"><span>Profile</span></Link>
              <button className="nav-btn capsule-nav-btn logout-btn" onClick={handleLogout} style={{background:'none',border:'none',color:'#195030',fontWeight:600,cursor:'pointer'}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn"><span>Login</span></Link>
              <Link to="/register" className="nav-btn register-btn"><span>Register</span></Link>
              <Link to="/about" className="nav-btn"><span>About Creators</span></Link>
            </>
          )}
        </div>
      </nav>
      <div className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            {isLoggedIn && userCrop ? (
              <>
                <h1 className="hero-title">
                  <span className="title-line">Welcome{userName ? `, ${userName}` : ''}!</span>
                  <span className="title-line">Your Crop:</span>
                  <span className="title-line">{userCrop}</span>
                </h1>
                <p className="hero-subtitle">
                  Here are personalized insights and recommendations for your {userCrop} crop.
                </p>
              </>
            ) : (
              <>
                <h1 className="hero-title">
                  <span className="title-line">Bridging</span>
                  <span className="title-line">Agriculture</span>
                  <span className="title-line">& Technology</span>
                </h1>
                <p className="hero-subtitle">
                  Empowering farmers with cutting-edge technology to revolutionize 
                  agricultural practices and maximize crop yields through intelligent 
                  AI-driven insights.
                </p>
                {!isLoggedIn && (
                  <div className="hero-buttons">
                    <Link to="/register" className="cta-btn secondary-btn">
                      <span>Start Your Journey</span>
                      <span style={{fontSize: '20px'}}>→</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="hero-visual">
            <div className="feature-showcase">
              <div className="feature-card">
                <div className="feature-icon">{features[currentFeature].icon}</div>
                <h3 className="feature-title">{features[currentFeature].title}</h3>
                <p className="feature-description">{features[currentFeature].description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="description-section">
          <div className="description-container">
            <h2 className="section-title">Welcome to CropEra</h2>
            <div className="description-grid">
              <div className="description-item">
                <div className="description-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  CropEra is dedicated to transforming traditional farming through smart technology. 
                  We provide real-time, data-driven insights to help farmers make informed decisions 
                  about irrigation, crop protection, and resource management.
                </p>
              </div>
              <div className="description-item">
                <div className="description-icon">🌡️</div>
                <h3>Weather Intelligence</h3>
                <p>
                  Get accurate weather forecasts and personalized recommendations for your crops. 
                  Our system analyzes temperature, humidity, rainfall, and other critical factors 
                  to optimize your farming schedule.
                </p>
              </div>
              <div className="description-item">
                <div className="description-icon">💧</div>
                <h3>Smart Irrigation</h3>
                <p>
                  Save water and improve crop health with our intelligent irrigation advisory. 
                  We help you maintain optimal soil moisture levels based on real-time weather 
                  data and crop requirements.
                </p>
              </div>
              <div className="description-item">
                <div className="description-icon">🦠</div>
                <h3>Disease Prevention</h3>
                <p>
                  Stay ahead of crop diseases with our early warning system. We monitor weather 
                  patterns and environmental conditions to predict and prevent potential crop 
                  health issues.
                </p>
              </div>
            </div>
            <div className="benefits-list">
              <h3>Key Benefits</h3>
              <ul>
                <li>Reduce water wastage by up to 30%</li>
                <li>Increase crop yield through optimized care</li>
                <li>Minimize crop diseases and losses</li>
                <li>Make data-driven farming decisions</li>
                <li>Access expert agricultural advice</li>
              </ul>
            </div>
          </div>
        </div>
        <Link to="/tech-predictions" className="home-link" style={{marginTop: 24, display: 'inline-block', background: '#1976d2', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 500, textDecoration: 'none'}}>Technology Predictions</Link>
      </div>
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
            <Link to="/about">About Creators</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Crop-era. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 