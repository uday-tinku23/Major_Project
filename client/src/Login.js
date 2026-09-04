import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './assets/logo.png';
import former from './assets/former.jpg';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getFirebaseLoginErrorMessage = (error) => {
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No user found with this email.';
        case 'auth/wrong-password':
          return 'Incorrect password.';
        case 'auth/invalid-email':
          return 'Invalid email address.';
        default:
          return error.message;
      }
    }
    return error.message || 'Login failed.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use Firebase Auth for login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // Optionally, store user info in localStorage
      localStorage.setItem('user', JSON.stringify(userCredential.user));
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(getFirebaseLoginErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email
        })
      });
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="bg-img">
        <img src={former} id="loginBgimg" alt="farmer background" />
      </div>
      <div className="loginBox">
        <img src={logo} id='logo' alt='logo' />
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            marginBottom: '16px',
            background: '#fff',
            color: '#195030',
            border: '1px solid #195030',
            borderRadius: '12px',
            padding: '12px 0',
            fontWeight: 600,
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 22, height: 22 }} />
          Continue with Google
        </button>
        <div className="divider">
          <span>Login with Email</span>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="inputContainer">
          <form onSubmit={handleSubmit}>
            <div className="input">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <button id="login" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <p style={{ marginTop: '18px', textAlign: 'center' }}>
              Don't have an account?{' '}
              <button type="button" style={{ background: 'none', border: 'none', color: '#195030', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', padding: 0 }} onClick={() => navigate('/register')}>
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 