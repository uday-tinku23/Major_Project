import React, { useEffect, useState } from 'react';
import './Profile.css';

const crops = [
  'Rice',
  'Wheat',
  'Cotton',
  'Sugar Cane',
  'Tomato',
  'Brinjal',
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    setUser(localUser);
    if (localUser && localUser.email) {
      fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(users => {
          const found = users.find(u => u.email === localUser.email);
          setBackendUser(found);
          setSelectedCrop(found?.crop || '');
        });
    }
  }, [successMsg]);

  const handleEdit = () => {
    setEditing(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!selectedCrop) {
      setErrorMsg('Please select a crop.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/update-crop', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, crop: selectedCrop }),
      });
      if (!res.ok) throw new Error('Failed to update crop.');
      setSuccessMsg('Crop updated successfully!');
      setEditing(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (!user) {
    return <div className="profile-page"><div className="profile-card">Not logged in.</div></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card enhanced">
        <div className="profile-avatar">
          {user.displayName || user.name ? (user.displayName || user.name).split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
        </div>
        <h2>My Profile</h2>
        <div className="profile-info">
          <div><strong>Name:</strong> {user.displayName || user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div className="crop-row">
            <strong>Crop:</strong>
            {editing ? (
              <>
                <select
                  value={selectedCrop}
                  onChange={e => setSelectedCrop(e.target.value)}
                  className="crop-select"
                >
                  <option value="">Select Crop</option>
                  {crops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <span className="crop-value">{backendUser?.crop || 'Not set'}</span>
                <button className="edit-btn" onClick={handleEdit}>Edit</button>
              </>
            )}
          </div>
        </div>
        {successMsg && <div className="success-msg">{successMsg}</div>}
        {errorMsg && <div className="error-msg">{errorMsg}</div>}
      </div>
    </div>
  );
} 