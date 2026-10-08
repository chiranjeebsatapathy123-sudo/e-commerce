import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Star, TrendingUp, Zap } from 'lucide-react';

const LoyaltyDashboard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('/api/gamification/status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStatus(res.data.data);
      } catch (error) {
        console.error("Failed to fetch gamification status", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return <div className="h-48 flex items-center justify-center text-gray-400">Loading Rewards...</div>;
  }

  if (!status) return null;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Bronze': return 'from-amber-600 to-amber-900 shadow-amber-900/50 text-amber-100';
      case 'Silver': return 'from-gray-300 to-gray-500 shadow-gray-500/50 text-gray-900';
      case 'Gold': return 'from-yellow-400 to-yellow-600 shadow-yellow-500/50 text-yellow-900';
      case 'Platinum': return 'from-slate-200 via-purple-300 to-slate-400 shadow-purple-500/50 text-slate-900';
      default: return 'from-gray-700 to-gray-900 text-white';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${getTierColor(status.tier)} transform transition-all duration-500 hover:scale-[1.01]`}>
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <Award size={120} className="animate-pulse" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Star className="fill-current" size={24} />
          <h2 className="text-2xl font-bold tracking-tight uppercase">{status.tier} Member</h2>
        </div>
        
        <p className="opacity-90 mb-8 font-medium">You have <span className="text-3xl font-extrabold mx-1">{status.points}</span> Spark Points.</p>

        {status.nextTier && (
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold opacity-90 flex items-center gap-2">
                <TrendingUp size={16} /> Progress to {status.nextTier}
              </span>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">{status.progressToNextTier.toFixed(0)}%</span>
            </div>
            
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${status.progressToNextTier}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20 py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
            <Zap size={18} /> Earn Points
          </button>
          <button className="flex-1 bg-black/20 hover:bg-black/30 backdrop-blur border border-black/10 py-3 rounded-xl font-bold transition-colors">
            View Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;
