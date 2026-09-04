import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Register.css';
import logo from './assets/logo.png';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';

const crops = [
  { name: 'Rice', icon: '🌾' },
  { name: 'Wheat', icon: '🌱' },
  { name: 'Cotton', icon: '🧵' },
  { name: 'Sugar Cane', icon: '🍬' },
  { name: 'Tomato', icon: '🍅' },
  { name: 'Brinjal', icon: '🍆' },
];

export default function CropSelect() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const password = searchParams.get('password');
  const [showVerifyMsg, setShowVerifyMsg] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCrop) {
      setError('Please select a crop.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // 1. Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      // 2. Register user in backend
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, crop: selectedCrop }),
      });
      if (!response.ok) {
        throw new Error('Failed to register user.');
      }
      setShowVerifyMsg(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyClick = async () => {
    setVerifyError('');
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        navigate('/login');
      } else {
        setVerifyError('Your email is not verified yet. Please check your inbox and click the verification link.');
      }
    } else {
      setVerifyError('No user found. Please register again.');
    }
  };

  return (
    <>
      {showVerifyMsg ? (
        <div className="registerPage">
          <div className="registerBox">
            <img src={logo} id="logo" alt="logo" />
            <h2 id="heading">Verify Your Email</h2>
            <div className="divider"><span>Check your inbox</span></div>
            <div className="error-message" style={{color:'#195030',background:'#e8f5e9',border:'1px solid #c8e6c9'}}>
              A verification email has been sent to your email address.<br />
              Please verify your email before continuing.
            </div>
            {verifyError && (
              <div className="error-message" style={{marginTop: 8}}>{verifyError}</div>
            )}
            <button id="signup" type="button" style={{width:'100%',marginTop:12}} onClick={handleVerifyClick}>I've Verified My Email</button>
          </div>
          <div className="bg-img"></div>
        </div>
      ) : (
        <div className="registerPage">
          <div className="registerBox">
            <img src={logo} id="logo" alt="logo" />
            <h2 id="heading">Select Your Crop</h2>
            <div className="divider"><span>Choose one crop to continue</span></div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', margin: '32px 0' }}>
                {crops.map((crop) => (
                  <button
                    type="button"
                    key={crop.name}
                    onClick={() => handleCropSelect(crop.name)}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      border: selectedCrop === crop.name ? '3px solid #195030' : '2px solid #bdbdbd',
                      background: selectedCrop === crop.name ? 'linear-gradient(135deg, #195030, #2e7d32)' : '#fff',
                      color: selectedCrop === crop.name ? '#fff' : '#195030',
                      fontSize: 32,
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedCrop === crop.name ? '0 4px 16px rgba(25,80,48,0.15)' : '0 2px 8px rgba(25,80,48,0.08)',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 36 }}>{crop.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{crop.name}</span>
                  </button>
                ))}
              </div>
              <button
                type="submit"
                id="signup"
                disabled={isLoading}
                style={{ width: '100%', marginTop: 12 }}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          </div>
          <div className="bg-img">
            {/* Optionally add a background image or illustration here */}
          </div>
        </div>
      )}
    </>
  );
} 