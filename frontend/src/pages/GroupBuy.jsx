import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Timer, ChevronRight, Share2, TrendingDown, Clock, ShieldCheck, Flame } from 'lucide-react';

const GroupBuy = ({ addToCart }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const groupBuyDeals = [
    {
      id: 301,
      name: "PlayStation 5 Pro Console",
      originalPrice: 599.99,
      soloPrice: 599.99,
      groupPrice: 449.99,
      targetGroupSize: 5,
      currentGroupSize: 3,
      endsIn: "04:12:45",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500"
    },
    {
      id: 302,
      name: "Apple AirPods Max (Space Gray)",
      originalPrice: 549.00,
      soloPrice: 549.00,
      groupPrice: 389.00,
      targetGroupSize: 10,
      currentGroupSize: 8,
      endsIn: "01:25:10",
      image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500"
    },
    {
      id: 303,
      name: "Dyson V15 Detect Absolute",
      originalPrice: 749.99,
      soloPrice: 699.99,
      groupPrice: 499.99,
      targetGroupSize: 3,
      currentGroupSize: 1,
      endsIn: "12:05:00",
      image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500"
    }
  ];

  const calculateDiscount = (orig, group) => {
    return Math.round(((orig - group) / orig) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 md:w-2/3">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              <Flame size={16} className="text-yellow-300" /> Team Buy Trending
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Team Up. Price Down.</h1>
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              Join forces with other shoppers. When the group target is met within the time limit, everyone unlocks massive wholesale discounts.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-red-600 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                Start a Group <ChevronRight size={18} />
              </button>
              <button className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-black/30 transition-colors flex items-center gap-2">
                <Share2 size={18} /> Invite Friends
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('active')}
            className={`pb-4 font-bold text-lg transition-colors relative ${activeTab === 'active' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Active Groups
            {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('my')}
            className={`pb-4 font-bold text-lg transition-colors relative ${activeTab === 'my' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            My Teams
            {activeTab === 'my' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full"></div>}
          </button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupBuyDeals.map(deal => (
            <div key={deal.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col h-full">
              
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-md flex items-center gap-1 z-10">
                  <TrendingDown size={16} /> {calculateDiscount(deal.originalPrice, deal.groupPrice)}% OFF
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-1 z-10 text-gray-800">
                  <Clock size={16} className="text-orange-500" /> Ends {deal.endsIn}
                </div>
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{deal.name}</h3>
                
                <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100 relative overflow-hidden">
                  <div className="flex justify-between items-end mb-2 relative z-10">
                    <div>
                      <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Group Price</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-red-600">${deal.groupPrice}</span>
                        <span className="text-sm text-red-400 line-through mb-1">${deal.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 relative z-10">
                    <div className="flex justify-between text-xs font-bold text-red-800 mb-1">
                      <span>{deal.currentGroupSize} Joined</span>
                      <span>Need {deal.targetGroupSize}</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${(deal.currentGroupSize / deal.targetGroupSize) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => addToCart({ ...deal, price: deal.soloPrice, quantity: 1, stock: 10 })}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition-colors text-sm flex flex-col items-center justify-center"
                  >
                    <span>Buy Solo</span>
                    <span className="text-gray-500 text-xs">${deal.soloPrice}</span>
                  </button>
                  <button 
                    onClick={() => {
                      // We add them to cart with group price, but in real app this would trigger a different checkout flow
                      alert(`You joined the Team Buy for ${deal.name}! Share with friends to hit the goal!`);
                      addToCart({ ...deal, price: deal.groupPrice, quantity: 1, stock: 10, isGroupBuy: true });
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md flex flex-col items-center justify-center"
                  >
                    <span>Join Team</span>
                    <span className="text-red-200 text-xs">${deal.groupPrice}</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Risk-Free Guarantee</h4>
              <p className="text-gray-500">If the group doesn't hit its target in time, you'll be refunded automatically within 24 hours.</p>
            </div>
          </div>
          <button className="bg-white border border-gray-300 text-gray-900 px-6 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-colors whitespace-nowrap">
            Learn More
          </button>
        </div>

      </div>
    </div>
  );
};

export default GroupBuy;
