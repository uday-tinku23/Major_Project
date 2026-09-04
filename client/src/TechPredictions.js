import React, { useEffect, useState } from 'react';
import './Store.css';

export default function TechPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [minConfidence, setMinConfidence] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    let url = '/api/tech-predictions?';
    if (search) url += `technology=${encodeURIComponent(search)}&`;
    if (type) url += `type=${encodeURIComponent(type)}&`;
    if (minConfidence) url += `minConfidence=${minConfidence}&`;
    if (year) url += `year=${year}&`;
    fetch(url)
      .then(res => res.json())
      .then(data => setPredictions(data));
  }, [search, type, minConfidence, year]);

  return (
    <div className="store-bg">
      <div className="store-header">
        <h1>Technology Predictions</h1>
      </div>
      <div style={{maxWidth: 900, margin: '24px auto'}}>
        <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24}}>
          <input
            type="text"
            placeholder="Search technology..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{padding: 8, borderRadius: 6, border: '1px solid #ccc', flex: 1}}
          />
          <select value={type} onChange={e => setType(e.target.value)} style={{padding: 8, borderRadius: 6}}>
            <option value="">All Types</option>
            <option value="Growth">Growth</option>
            <option value="Adoption">Adoption</option>
            <option value="Risk">Risk</option>
          </select>
          <input
            type="number"
            placeholder="Min Confidence %"
            value={minConfidence}
            onChange={e => setMinConfidence(e.target.value)}
            style={{padding: 8, borderRadius: 6, width: 140}}
            min={0} max={100}
          />
          <input
            type="number"
            placeholder="Target Year"
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{padding: 8, borderRadius: 6, width: 120}}
          />
        </div>
        <div className="store-grid">
          {predictions.length === 0 ? (
            <div style={{color: '#888', fontSize: 18, margin: '32px auto'}}>No predictions found.</div>
          ) : predictions.map(pred => (
            <div className="store-card" key={pred.id} style={{maxWidth: 340}}>
              <img className="store-card-img" src={pred.image} alt={pred.technology} />
              <div className="store-card-title">{pred.technology}</div>
              <div className="store-card-details">
                <span className="store-chip">{pred.type}</span>
                <span className="store-chip">{pred.targetYear}</span>
              </div>
              <div style={{margin: '12px 0', color: '#444'}}>{pred.description}</div>
              <div style={{margin: '8px 0 4px', fontWeight: 500}}>Confidence: {pred.confidence}%</div>
              <div style={{background: '#e3f2fd', borderRadius: 6, height: 10, width: '100%'}}>
                <div style={{width: `${pred.confidence}%`, background: '#1976d2', height: 10, borderRadius: 6}}></div>
              </div>
              <div style={{fontSize: 13, color: '#888', marginTop: 8}}>Reported: {pred.reportedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 