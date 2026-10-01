import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Settings, RefreshCw, Check, Shield } from 'lucide-react';

const PersonalizationCenter = ({ userInfo }) => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    personalizedRecommendations: true,
    shoppingMemory: true,
    recentlyViewed: true,
    priceAlerts: true,
    marketingMessages: false,
    aiShoppingContext: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchPrefs();
  }, [userInfo, navigate]);

  const fetchPrefs = async () => {
    try {
      const { data } = await api.get('/commerce-brain/preferences');
      setPrefs({
        personalizedRecommendations: data.personalizedRecommendations,
        shoppingMemory: data.shoppingMemory,
        recentlyViewed: data.recentlyViewed,
        priceAlerts: data.priceAlerts,
        marketingMessages: data.marketingMessages,
        aiShoppingContext: data.aiShoppingContext
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    try {
      await api.put('/commerce-brain/preferences', updated);
    } catch (err) {
      console.error(err);
      // Revert on error
      setPrefs({ ...prefs });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all preferences to default?')) return;
    setSaving(true);
    try {
      const { data } = await api.post('/commerce-brain/preferences/reset');
      setPrefs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading preferences...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Settings size={32} className="text-primary" />
        <h1 style={{ margin: 0 }}>Personalization Center</h1>
      </div>
      <p className="text-muted" style={{ marginBottom: '32px' }}>
        Control how Spark AI and the Commerce Brain adapt to your shopping journey. We only use your data to improve your experience.
      </p>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Personalized Recommendations</strong>
              <span className="text-small text-muted">Show products based on your browsing history.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.personalizedRecommendations} onChange={() => handleToggle('personalizedRecommendations')} disabled={saving} />
              <span className="slider"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Shopping Memory</strong>
              <span className="text-small text-muted">Allow Spark AI to remember context across sessions.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.shoppingMemory} onChange={() => handleToggle('shoppingMemory')} disabled={saving} />
              <span className="slider"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Recently Viewed</strong>
              <span className="text-small text-muted">Keep track of products you recently looked at.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.recentlyViewed} onChange={() => handleToggle('recentlyViewed')} disabled={saving} />
              <span className="slider"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Price Alerts</strong>
              <span className="text-small text-muted">Allow proactive notifications for price drops.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.priceAlerts} onChange={() => handleToggle('priceAlerts')} disabled={saving} />
              <span className="slider"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Marketing Messages</strong>
              <span className="text-small text-muted">Receive personalized marketing campaigns.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.marketingMessages} onChange={() => handleToggle('marketingMessages')} disabled={saving} />
              <span className="slider"></span>
            </label>
          </div>

        </div>
        
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
            <Shield size={16} />
            <span className="text-small">Privacy First</span>
          </div>
          <button onClick={handleReset} disabled={saving} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} style={{ marginRight: '6px' }} /> Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationCenter;
