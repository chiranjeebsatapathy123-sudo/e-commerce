import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Recycle, Wind, Droplets, ArrowRight, ShieldCheck, Tag, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EcoHub = ({ userInfo }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shop');

  const prelovedProducts = [
    {
      id: "eco-1",
      name: "Refurbished iPhone 14 Pro",
      condition: "Excellent (Grade A)",
      price: 649,
      originalPrice: 999,
      savedCO2: "54kg",
      image: "https://images.unsplash.com/photo-1695048132974-90b968742512?w=500",
    },
    {
      id: "eco-2",
      name: "Pre-owned Herman Miller Aeron",
      condition: "Good (Grade B)",
      price: 450,
      originalPrice: 1200,
      savedCO2: "112kg",
      image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500",
    },
    {
      id: "eco-3",
      name: "Vintage Patagonia Fleece",
      condition: "Like New",
      price: 85,
      originalPrice: 150,
      savedCO2: "12kg",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
    }
  ];

  return (
    <div className="min-h-screen bg-[#061c10] pt-24 pb-20 font-sans text-white relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-6 border border-emerald-500/30">
            <Leaf size={16} /> Spark Eco Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100">
            Shop Sustainably. <br/>Save the Planet.
          </h1>
          <p className="text-xl text-emerald-100/70 font-medium">
            Discover certified pre-loved items, trade in your old gear for Spark Coins, and track your carbon footprint reduction.
          </p>
        </div>

        {/* User Impact Dashboard */}
        {userInfo && (
          <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 mb-16 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 p-8 opacity-10">
              <Recycle size={200} className="text-emerald-500" />
            </div>
            
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              Your Eco Impact <Leaf className="text-emerald-400" />
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Wind className="text-emerald-400" />
                  </div>
                  <span className="font-bold text-gray-400">CO2 Saved</span>
                </div>
                <div className="text-4xl font-black text-emerald-400 mb-1">124 <span className="text-lg text-emerald-400/50">kg</span></div>
                <p className="text-sm text-gray-500">Equivalent to planting 6 trees</p>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Droplets className="text-blue-400" />
                  </div>
                  <span className="font-bold text-gray-400">Water Saved</span>
                </div>
                <div className="text-4xl font-black text-blue-400 mb-1">4.2 <span className="text-lg text-blue-400/50">kL</span></div>
                <p className="text-sm text-gray-500">Equivalent to 60 showers</p>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Recycle className="text-amber-400" />
                  </div>
                  <span className="font-bold text-gray-400">Items Recycled</span>
                </div>
                <div className="text-4xl font-black text-amber-400 mb-1">7 <span className="text-lg text-amber-400/50">items</span></div>
                <p className="text-sm text-gray-500">Kept out of landfills</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('shop')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'shop' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Shop Pre-loved
            </button>
            <button 
              onClick={() => setActiveTab('tradein')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'tradein' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Trade-in Program
            </button>
          </div>
        </div>

        {/* Shop Pre-loved */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prelovedProducts.map((product) => (
              <div key={product.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-colors group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                    Spark Certified
                  </div>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-emerald-400 font-bold mb-4 flex items-center gap-1">
                    <CheckCircle2 size={16} /> Condition: {product.condition}
                  </p>
                  
                  <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-black">${product.price}</span>
                      <span className="text-sm text-gray-500 line-through">New: ${product.originalPrice}</span>
                    </div>
                    <div className="text-xs text-emerald-300 flex items-center gap-1">
                      <Leaf size={12} /> Saves {product.savedCO2} of CO2 compared to new
                    </div>
                  </div>
                  
                  <button className="w-full bg-white hover:bg-gray-200 text-black font-black py-3.5 rounded-xl transition-colors mt-auto">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trade In */}
        {activeTab === 'tradein' && (
          <div className="max-w-4xl mx-auto bg-white/5 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center backdrop-blur-md">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Recycle className="text-emerald-400 w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black mb-4">Turn Clutter into Spark Coins</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Send us your gently used electronics, apparel, and gear. We'll refurbish it or recycle it responsibly, and credit your Spark Wallet instantly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-4 text-xl font-black text-emerald-400">1</div>
                <h4 className="font-bold mb-2">Get an Estimate</h4>
                <p className="text-sm text-gray-400">Tell us what you have and get an instant AI-powered quote.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-4 text-xl font-black text-emerald-400">2</div>
                <h4 className="font-bold mb-2">Ship for Free</h4>
                <p className="text-sm text-gray-400">We send you a prepaid QR code. Just drop it off at any post office.</p>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-4 text-xl font-black text-emerald-400">3</div>
                <h4 className="font-bold mb-2">Get Paid instantly</h4>
                <p className="text-sm text-gray-400">Once verified, funds are added to your Spark Wallet immediately.</p>
              </div>
            </div>
            
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 py-4 rounded-xl shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all">
              Start a Trade-In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default EcoHub;
