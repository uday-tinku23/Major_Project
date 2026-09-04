import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #195030, #2e7d32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="registerBox" style={{ maxWidth: 700, margin: '40px auto', background: 'rgba(255,255,255,0.98)', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: 32 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 16 }}> CropEra - Terms and Conditions</h1>
        <ol style={{ paddingLeft: 0, listStyle: 'none' }}>
          <li style={{ marginBottom: 18 }}>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using CropEra, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the application.</p>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>2. Service Description</h2>
            <p>CropEra provides weather-based, crop-specific recommendations to assist farmers and agriculturists in making irrigation and pesticide spraying decisions.<br/>
            All information is provided <strong>for guidance purposes only</strong> and may not guarantee crop success.</p>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>3. User Responsibilities</h2>
            <ul>
              <li>You must provide accurate location and crop information for personalized recommendations.</li>
              <li>You are responsible for verifying the applicability of the advice provided.</li>
              <li>CropEra should not be used as a substitute for expert agricultural consultation.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>4. Limitation of Liability</h2>
            <p>CropEra strives to offer accurate, real-time advice based on weather APIs and stored data. However, we are <strong>not responsible for:</strong></p>
            <ul>
              <li>Inaccurate third-party weather data.</li>
              <li>Crop loss or damages resulting from decisions based solely on CropEra's recommendations.</li>
            </ul>
            <p>Use this platform at your own discretion and risk.</p>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>5. Third-Party Services</h2>
            <p>CropEra may integrate third-party APIs (like OpenWeatherMap) to provide weather data. We are <strong>not liable for any inaccuracies, downtime, or changes in these external services.</strong></p>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>6. Data Privacy</h2>
            <ul>
              <li>We may collect your location and crop preferences to offer personalized advice.</li>
              <li>Your personal information will not be shared, sold, or misused.</li>
              <li>By using the application, you consent to basic data collection for service improvement.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>7. Modification of Terms</h2>
            <p>CropEra reserves the right to modify these terms at any time. Continued use of the application after changes means you accept the revised terms.</p>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>8. Governing Law</h2>
            <p>These Terms and Conditions are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts located in Hyderabad, Telangana.</p>
          </li>
          <li style={{ marginBottom: 18 }}>
            <h2>9. Contact Us</h2>
            <p>For any questions or clarifications regarding these Terms and Conditions, please contact:<br/>
            <strong>Email:</strong> manikanthetikyala174@gmail.com<br/>
            <strong>Phone:</strong> 6309297589</p>
          </li>
        </ol>
        <button id="signup" style={{ marginTop: 32, width: '100%' }} onClick={() => navigate('/register?acceptTerms=true')}>
          Accept & Go to Register
        </button>
      </div>
    </div>
  );
} 