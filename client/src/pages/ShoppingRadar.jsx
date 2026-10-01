import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Activity, Bell, TrendingDown, Trash2 } from 'lucide-react';

const ShoppingRadar = ({ userInfo }) => {
  const navigate = useNavigate();
  const [radarItems, setRadarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchRadar();
  }, [userInfo, navigate]);

  const fetchRadar = async () => {
    try {
      const { data } = await api.get('/commerce-brain/radar');
      setRadarItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeRadarItem = async (id) => {
    try {
      await api.delete(`/commerce-brain/radar/${id}`);
      fetchRadar();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading radar...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={32} className="text-primary" />
          <h1 style={{ margin: 0 }}>Shopping Radar</h1>
        </div>
      </div>

      <p className="text-muted" style={{ marginBottom: '32px' }}>
        Actively monitoring your selected products for price drops, restocks, and important updates.
      </p>

      {radarItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <Bell size={48} className="text-muted" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3>Radar Empty</h3>
          <p className="text-muted">You are not monitoring any products. Add products from their details page.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {radarItems.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px' }}>{item.product.name}</h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                  <span style={{ color: item.product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span>Current Price: ${parseFloat(item.product.price).toFixed(2)}</span>
                  {item.targetPrice && (
                    <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingDown size={14} /> Target: ${parseFloat(item.targetPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <button onClick={() => removeRadarItem(item.id)} className="btn btn-icon" style={{ color: 'var(--danger)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingRadar;
