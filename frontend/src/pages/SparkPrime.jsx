import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Truck, PlaySquare, Music, ShieldCheck, Zap, Sparkles, ChevronRight, Check } from 'lucide-react';

const SparkPrime = ({ userInfo, addToCart }) => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  // If user is not logged in, show marketing page. 
  // If user IS logged in, we could conditionally show their active membership, but we'll focus on the premium upsell for now.
  const isMember = userInfo?.isSparkPrime === true;

  const mockPrimeDeals = [
    {
      id: 101,
      name: "Sony WH-1000XM5 (Prime Exclusive)",
      originalPrice: 399.99,
      primePrice: 249.99,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500"
    },
    {
      id: 102,
      name: "Spark Smart Home Hub",
      originalPrice: 129.99,
      primePrice: 59.99,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden pb-20">
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/30 to-purple-600/30 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Crown size={16} className="text-yellow-400" />
            <span className="text-sm font-semibold tracking-wide uppercase">Introducing Spark Prime</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            The Ultimate <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Shopping Experience
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light">
            Unlimited ultra-fast delivery, exclusive early access to drops, and world-class entertainment, all in one membership.
          </p>

          {!isMember ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center bg-white/10 p-1 rounded-full backdrop-blur-md border border-white/10 mb-8">
                <button 
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${isAnnual ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Annually <span className="text-green-400 ml-1 text-xs">Save 25%</span>
                </button>
              </div>

              <button className="group relative px-8 py-4 bg-white text-black font-black text-lg rounded-full overflow-hidden hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="relative flex items-center gap-2">
                  Start Your 30-Day Free Trial <ChevronRight size={20} />
                </span>
              </button>
              <p className="mt-4 text-sm text-gray-500">
                Then {isAnnual ? '$139/year' : '$14.99/month'}. Cancel anytime.
              </p>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 max-w-xl mx-auto backdrop-blur-xl">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown size={32} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">You are a Prime Member</h3>
                  <p className="text-gray-400">Member since 2023</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10 text-left">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Money Saved</p>
                  <p className="text-3xl font-black text-green-400">$342.50</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Next Billing</p>
                  <p className="text-xl font-bold">Oct 24, 2026</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Everything included in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Prime</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck size={28} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Ultra-Fast Delivery</h3>
            <p className="text-gray-400 leading-relaxed">
              Get free Same-Day, One-Day, and Two-Day Delivery on millions of items. No minimum purchase required.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlaySquare size={28} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Spark Stream</h3>
            <p className="text-gray-400 leading-relaxed">
              Watch award-winning original series, blockbuster movies, and live sports included with your membership.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Music size={28} className="text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Spark Audio</h3>
            <p className="text-gray-400 leading-relaxed">
              Ad-free listening to 100 million songs and millions of podcast episodes. High-fidelity audio included.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={28} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Exclusive Drops</h3>
            <p className="text-gray-400 leading-relaxed">
              Get 30-minute early access to Lightning Deals and exclusive high-demand sneaker and tech drops.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Extended Warranty</h3>
            <p className="text-gray-400 leading-relaxed">
              Automatic 1-year warranty extension on all electronics and appliances purchased through Spark.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Personal Shopper</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Unlimited access to our advanced Spark AI agent that curates your wardrobe and decor based on your taste.
              </p>
              <button className="bg-white text-purple-900 px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                Try it now
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Exclusive Deals Teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Prime Exclusive Deals <Crown size={24} className="text-yellow-400" />
            </h2>
            <p className="text-gray-400">Sneak peek at deals reserved only for members today.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300">
            View all deals <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockPrimeDeals.map(deal => (
            <div key={deal.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col sm:flex-row group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="w-full sm:w-2/5 h-48 sm:h-auto bg-white/10">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6 flex flex-col justify-center w-full sm:w-3/5">
                <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md self-start mb-3 uppercase tracking-wider">
                  Prime Member Deal
                </div>
                <h3 className="text-xl font-bold mb-4">{deal.name}</h3>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black text-white">${deal.primePrice}</span>
                  <span className="text-lg text-gray-500 line-through mb-1">${deal.originalPrice}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({ ...deal, price: deal.primePrice, stock: 10 });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SparkPrime;
