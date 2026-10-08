import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Clock, TrendingUp, Flame, AlertCircle, Search, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Auctions = ({ userInfo }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('live');
  const [bidAmount, setBidAmount] = useState('');
  
  const [auctions, setAuctions] = useState([
    {
      id: "a-1",
      name: "Vintage Rolex Daytona 1972",
      type: "Luxury",
      currentBid: 42500,
      bidsCount: 34,
      highestBidder: "Alex***",
      endsIn: 3600, // seconds
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
      isLive: true
    },
    {
      id: "a-2",
      name: "Air Jordan 1 'Chicago' 1985 DS",
      type: "Streetwear",
      currentBid: 12400,
      bidsCount: 89,
      highestBidder: "SneakerK***",
      endsIn: 7200,
      image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=500",
      isLive: true
    },
    {
      id: "a-3",
      name: "Tesla Cyberquad (Limited Edition)",
      type: "Tech",
      currentBid: 3200,
      bidsCount: 12,
      highestBidder: "ElonFan***",
      endsIn: 86400,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500",
      isLive: true
    }
  ]);

  // Timer logic for countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prev => prev.map(auction => ({
        ...auction,
        endsIn: Math.max(0, auction.endsIn - 1)
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = (auctionId, currentBid) => {
    if (!userInfo) {
      navigate('/login?redirect=/auctions');
      return;
    }
    
    const bidValue = parseFloat(bidAmount);
    if (!bidValue || bidValue <= currentBid) {
      alert(`Your bid must be higher than $${currentBid.toLocaleString()}`);
      return;
    }

    // In a real app, this would emit a socket event to update all clients
    setAuctions(prev => prev.map(a => 
      a.id === auctionId 
        ? { ...a, currentBid: bidValue, bidsCount: a.bidsCount + 1, highestBidder: "You" }
        : a
    ));
    setBidAmount('');
    alert('Bid placed successfully! You are now the highest bidder.');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] pt-24 pb-20 font-sans text-white">
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-black border border-white/10 p-8 md:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-6 border border-indigo-500/30">
                <Gavel size={16} /> Elite Auctions
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Bid. Win. <br/>Own the Rare.
              </h1>
              <p className="text-xl text-gray-400 mb-8 font-medium">
                Exclusive access to limited edition drops, luxury goods, and authenticated collectibles. Place your bids in real-time.
              </p>
              
              <div className="flex gap-4">
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all flex items-center gap-2">
                  View Live Drops <ChevronRight size={20} />
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                  <ShieldCheck size={20} /> Authenticated
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                  <Flame size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Anti-Snipe Protection</h4>
                  <p className="text-sm text-gray-400 mt-1">Bids placed in the final 2 minutes reset the timer.</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">100% Verified</h4>
                  <p className="text-sm text-gray-400 mt-1">Every auctioned item passes rigorous physical inspection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('live')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'live' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Live Auctions
            </button>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'upcoming' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Upcoming Drops
            </button>
            <button 
              onClick={() => setActiveTab('my_bids')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'my_bids' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              My Bids
            </button>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search auctions..." className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      {/* Auction Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <motion.div 
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-indigo-500/50 transition-colors flex flex-col"
            >
              {/* Image & Badges */}
              <div className="relative h-72 bg-gray-900 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <div className="bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE
                  </div>
                  <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold uppercase shadow-lg border border-white/10">
                    {auction.type}
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl">
                  <Clock size={16} className={auction.endsIn < 3600 ? 'text-red-500 animate-pulse' : 'text-indigo-400'} />
                  <span className={`font-black tracking-wider ${auction.endsIn < 3600 ? 'text-red-500' : 'text-white'}`}>
                    {formatTime(auction.endsIn)}
                  </span>
                </div>
                
                <img 
                  src={auction.image} 
                  alt={auction.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-4 line-clamp-1">{auction.name}</h3>
                
                <div className="bg-black/50 rounded-2xl p-4 border border-white/5 mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">Current Bid</p>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                        ${auction.currentBid.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold mb-1">Highest Bidder</p>
                      <div className="text-sm font-bold bg-white/10 px-2 py-1 rounded-md">{auction.highestBidder}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-4 pt-4 border-t border-white/10">
                    <TrendingUp size={14} /> {auction.bidsCount} bids placed so far
                  </div>
                </div>

                {/* Bidding Controls */}
                <div className="mt-auto flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder={(auction.currentBid + 100).toLocaleString()}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={() => handlePlaceBid(auction.id, auction.currentBid)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Auctions;
