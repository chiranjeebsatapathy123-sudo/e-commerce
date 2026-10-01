import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Share2, TrendingUp, Plus } from 'lucide-react';

const CreatorStudio = ({ userInfo }) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (userInfo) {
      api.get('/collections').then(res => {
        setCollections(res.data.filter(c => c.creatorId === userInfo.id));
      });
    }
  }, [userInfo]);

  const handleCreate = async () => {
    const name = prompt("Name your new collection:");
    if (!name) return;
    try {
      const res = await api.post('/collections', { name, description: 'My curated picks', products: [] });
      setCollections([...collections, res.data]);
    } catch (e) {
      alert("Failed to create collection");
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Creator Studio</h1>
          <p className="text-muted">Manage your curated storefronts and track affiliate earnings.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={16} /> New Collection
        </button>
      </div>

      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Total Earnings</h3>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            $0.00 <TrendingUp size={20} className="text-success" />
          </h2>
        </div>
      </div>

      <div className="collections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {collections.map(c => (
          <div key={c.id} className="glass-panel" style={{ padding: '24px' }}>
            <h3>{c.name}</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>{c.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-primary">{c.views} Views</span>
              <button className="btn btn-secondary btn-sm" onClick={() => alert(`Share link: ${window.location.origin}/collection/${c.id}`)}>
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorStudio;
