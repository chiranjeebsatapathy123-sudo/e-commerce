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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Syncing preferences...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Settings size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Personalization Center</h1>
          <p className="text-gray-500 max-w-lg">
            Fine-tune how Spark AI and the Commerce Brain adapt to your shopping journey. Your data is encrypted and used only to enhance your experience.
          </p>
        </div>

        {/* Control Center Panel */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              
              {/* Toggle 1 */}
              <div className="flex justify-between items-center group">
                <div className="pr-8">
                  <strong className="block text-gray-900 font-bold mb-1">Personalized Recommendations</strong>
                  <span className="text-sm text-gray-500 leading-snug block">Curate product suggestions based on your browsing history and purchases.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={prefs.personalizedRecommendations} onChange={() => handleToggle('personalizedRecommendations')} disabled={saving} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Toggle 2 */}
              <div className="flex justify-between items-center group">
                <div className="pr-8">
                  <strong className="block text-gray-900 font-bold mb-1">Shopping Memory</strong>
                  <span className="text-sm text-gray-500 leading-snug block">Allow Spark AI to remember context across different sessions and devices.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={prefs.shoppingMemory} onChange={() => handleToggle('shoppingMemory')} disabled={saving} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Toggle 3 */}
              <div className="flex justify-between items-center group">
                <div className="pr-8">
                  <strong className="block text-gray-900 font-bold mb-1">Recently Viewed History</strong>
                  <span className="text-sm text-gray-500 leading-snug block">Keep a continuous track of products you recently looked at.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={prefs.recentlyViewed} onChange={() => handleToggle('recentlyViewed')} disabled={saving} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Toggle 4 */}
              <div className="flex justify-between items-center group">
                <div className="pr-8">
                  <strong className="block text-gray-900 font-bold mb-1">Smart Price Alerts</strong>
                  <span className="text-sm text-gray-500 leading-snug block">Proactive notifications when wishlisted items drop in price.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={prefs.priceAlerts} onChange={() => handleToggle('priceAlerts')} disabled={saving} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Toggle 5 */}
              <div className="flex justify-between items-center group">
                <div className="pr-8">
                  <strong className="block text-gray-900 font-bold mb-1">Marketing Messages</strong>
                  <span className="text-sm text-gray-500 leading-snug block">Receive highly personalized marketing campaigns and offers.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={prefs.marketingMessages} onChange={() => handleToggle('marketingMessages')} disabled={saving} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

            </div>
          </div>
          
          {/* Footer of Control Center */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <Shield size={16} />
              <span>Privacy First Architecture</span>
            </div>
            <button onClick={handleReset} disabled={saving} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50">
              <RefreshCw size={14} /> Reset Defaults
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonalizationCenter;
