import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Terms from './Terms';
import CropSelect from './CropSelect';
import About from './About';
import Profile from './Profile';
import WeatherAdvisor from './Weather';
import Store from './Store';
import Cart from './Cart';
import Wishlist from './Wishlist';
import TechPredictions from './TechPredictions';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Placeholder Dashboard component
const Dashboard = () => <div style={{padding: '2rem', textAlign: 'center'}}><h2>Dashboard</h2><p>Welcome to your dashboard!</p></div>;

const WeatherTracking = () => <div style={{padding:'2rem',textAlign:'center'}}><h2>Weather Tracking</h2><p>Weather tracking page coming soon.</p></div>;
const TechnologyPrediction = () => <div style={{padding:'2rem',textAlign:'center'}}><h2>Technology Prediction</h2><p>Technology prediction page coming soon.</p></div>;

function App() {
  return (
    <Router>
    <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/weather" element={<WeatherAdvisor />} />
          <Route path="/select-crop" element={<CropSelect />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/tech-predictions" element={<TechPredictions />} />
          <Route path="/tech-prediction" element={<Navigate to="/tech-predictions" replace />} />
          <Route path="/technology" element={<Navigate to="/tech-predictions" replace />} />
          <Route path="/" element={<Home />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
