import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Activity, Bell, TrendingDown, Trash2, Crosshair, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts'; // Mocking a chart for radar

const MOCK_CHART_DATA = [
  { pv: 2400 }, { pv: 1398 }, { pv: 9800 }, { pv: 3908 }, { pv: 4800 }, { pv: 3800 }, { pv: 4300 }
];

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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                <Crosshair size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shopping Radar</h1>
            </div>
            <p className="text-gray-500 max-w-xl">
              Your autonomous deal hunting system. We're actively tracking these products for price drops, restocks, and exclusive flash sales.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black text-gray-900">{radarItems.length}</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Trackers</span>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-black text-green-600">2</span>
              <span className="text-xs font-medium text-green-700 uppercase tracking-wider">Price Drops</span>
            </div>
          </div>
        </div>

        {radarItems.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <Activity size={40} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Radar is Clear</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You aren't tracking any products right now. Hit the "Track" button on any product page to let Spark AI monitor it for you.
            </p>
            <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md">
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {radarItems.map(item => {
              const currentPrice = parseFloat(item.product.price);
              const targetPrice = parseFloat(item.targetPrice);
              const isDrop = targetPrice && currentPrice <= targetPrice;
              
              return (
                <div key={item.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
                  
                  {/* Status Ribbon */}
                  {isDrop && (
                    <div className="absolute top-4 -right-8 bg-green-500 text-white text-xs font-bold px-10 py-1 rotate-45 z-10 shadow-sm">
                      PRICE DROP
                    </div>
                  )}
                  {item.product.stock === 0 && (
                    <div className="absolute top-4 -right-8 bg-red-500 text-white text-xs font-bold px-10 py-1 rotate-45 z-10 shadow-sm">
                      STOCKOUT
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.product.id}`)}>
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply p-2" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <h4 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight cursor-pointer hover:text-blue-600" onClick={() => navigate(`/product/${item.product.id}`)}>
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Current Price</p>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-black ${isDrop ? 'text-green-600' : 'text-gray-900'}`}>${currentPrice.toFixed(2)}</span>
                          </div>
                        </div>
                        {targetPrice && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Target</p>
                            <span className="text-lg font-bold text-gray-400">${targetPrice.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Mini Mock Chart */}
                      <div className="h-10 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MOCK_CHART_DATA}>
                            <Line type="monotone" dataKey="pv" stroke={isDrop ? "#16a34a" : "#cbd5e1"} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/product/${item.product.id}`)} className="flex-1 bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                        View Product <ArrowRight size={16} />
                      </button>
                      <button onClick={() => removeRadarItem(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Remove from Radar">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingRadar;
