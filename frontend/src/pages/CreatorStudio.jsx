import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, TrendingUp, Plus, Video, Image as ImageIcon, Store, Users, DollarSign, Activity, Star, Eye } from 'lucide-react';
import api from '../services/api';

const CreatorStudio = ({ userInfo }) => {
  const [collections, setCollections] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userInfo) {
      api.get('/collections').then(res => {
        setCollections(res.data.filter(c => c.creatorId === userInfo.id) || []);
      }).catch(() => setCollections([]));
    }
  }, [userInfo]);

  const handleCreate = async () => {
    const name = prompt("Name your new curated collection:");
    if (!name) return;
    try {
      const res = await api.post('/collections', { name, description: 'My curated picks', products: [] });
      setCollections([...collections, res.data]);
    } catch (e) {
      alert("Failed to create collection");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Creator Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {userInfo?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Creator Studio</h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <span>@{userInfo?.name?.toLowerCase().replace(/\s+/g, '') || 'creator'}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-purple-600 font-medium flex items-center gap-1"><Store size={14}/> Verified Partner</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <Video size={16} /> Go Live
              </button>
              <button onClick={handleCreate} className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={16} /> New Collection
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-6 mt-8 border-b border-gray-100">
            <button onClick={() => setActiveTab('overview')} className={`pb-4 font-medium transition-colors relative ${activeTab === 'overview' ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}>
              Overview
              {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('storefront')} className={`pb-4 font-medium transition-colors relative ${activeTab === 'storefront' ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}>
              My Storefront
              {activeTab === 'storefront' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`pb-4 font-medium transition-colors relative ${activeTab === 'analytics' ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}>
              Analytics
              {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full"></div>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20}/></div>
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/> +12.5%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Commission</h3>
                <h2 className="text-2xl font-bold text-gray-900">$4,250.00</h2>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20}/></div>
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/> +5.2%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Followers</h3>
                <h2 className="text-2xl font-bold text-gray-900">12.4K</h2>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Eye size={20}/></div>
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12} className="mr-1"/> +22.1%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Storefront Views</h3>
                <h2 className="text-2xl font-bold text-gray-900">45.2K</h2>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Activity size={20}/></div>
                  <span className="flex items-center text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Steady</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Conversion Rate</h3>
                <h2 className="text-2xl font-bold text-gray-900">3.8%</h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Content Hub</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="group cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-colors p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Video size={24} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Host a Live Stream</h4>
                    <p className="text-sm text-gray-500">Go live, showcase products in real-time, and earn instant commissions.</p>
                  </div>

                  <div className="group cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Post a Shoppable Video</h4>
                    <p className="text-sm text-gray-500">Upload a short-form video to the Social Feed and tag products.</p>
                  </div>

                  <div onClick={handleCreate} className="group cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 hover:bg-green-50 hover:border-green-200 transition-colors p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Star size={24} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Curate Collection</h4>
                    <p className="text-sm text-gray-500">Bundle your favorite items together to share with your audience.</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storefront' && (
          <div className="animate-fade-in">
            {collections.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                <Store size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Storefront is Empty</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">Create curated collections of products to share with your followers and start earning commissions.</p>
                <button onClick={handleCreate} className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md">
                  Create First Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(c => (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                      </div>
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md">{c.products?.length || 0} Items</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{c.name}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{c.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Eye size={14} className="mr-1" /> {c.views || 0} Views
                      </div>
                      <button className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-blue-600 transition-colors" onClick={() => alert(`Share link: ${window.location.origin}/collection/${c.id}`)}>
                        <Share2 size={16} /> Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Engine Syncing</h3>
            <p className="text-gray-500 max-w-md mx-auto">We're gathering your latest performance data. Check back soon for detailed insights on your audience engagement.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorStudio;
