import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, MessageCircle, Heart, Share2, Eye, Gift, ShoppingBag, Send, Users, Sparkles, AlertCircle } from 'lucide-react';

const LiveCommerce = ({ addToCart }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(12400);
  const [showProductFlyout, setShowProductFlyout] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const [chatLog, setChatLog] = useState([
    { id: 1, user: "SarahK", text: "Is this true to size?", isCreator: false },
    { id: 2, user: "MikeDrop", text: "Just ordered two!", isCreator: false },
    { id: 3, user: "SparkOfficial", text: "Yes Sarah, they fit perfectly true to size!", isCreator: true }
  ]);

  const featuredProduct = {
    id: 88,
    name: "Limited Edition Lunar Max Sneakers",
    price: 189.99,
    originalPrice: 220.00,
    stock: 12,
    image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=500"
  };

  useEffect(() => {
    // Add immersive dark theme specifically for this route
    document.body.classList.add('spatial-mode-active');
    
    // Simulate incoming chat messages
    const interval = setInterval(() => {
      const messages = [
        "Need these ASAP 🔥",
        "How fast is shipping?",
        "Omg the colorway is insane",
        "Take my money!",
        "Can we see the sole?",
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setChatLog(prev => [...prev, { id: Date.now(), user: `User${Math.floor(Math.random()*999)}`, text: randomMsg, isCreator: false }].slice(-15));
    }, 4500);

    return () => {
      document.body.classList.remove('spatial-mode-active');
      clearInterval(interval);
    };
  }, []);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLog(prev => [...prev, { id: Date.now(), user: "You", text: chatMessage, isCreator: false }]);
    setChatMessage('');
  };

  return (
    <div className="h-screen w-full bg-black flex overflow-hidden font-sans">
      
      {/* Video / Stream Area */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE
            </div>
            <div className="flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md">
              <Eye size={16} /> 12.4K
            </div>
            <div className="flex items-center gap-2 bg-black/50 border border-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md">
              <Users size={16} /> SparkOfficial
            </div>
          </div>

          <button onClick={() => navigate(-1)} className="bg-black/50 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors">
            <AlertCircle size={20} className="rotate-45" />
          </button>
        </div>

        {/* Video Controls & Product Trigger */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-20">
          <div className="flex gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md text-white transition-all">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md text-white transition-all">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>

          {/* Interactive Product Trigger */}
          <div className="relative group">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap animate-bounce shadow-lg shadow-purple-500/50">
              Only 12 left! 🔥
            </div>
            <button 
              onClick={() => setShowProductFlyout(!showProductFlyout)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl flex items-center gap-4 pr-6 shadow-xl hover:scale-105 transition-transform"
            >
              <img src={featuredProduct.image} alt={featuredProduct.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="text-left">
                <p className="text-white font-bold text-sm">Now Showing</p>
                <p className="text-white/80 text-xs font-medium">${featuredProduct.price}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Side Actions (Like, Share) */}
        <div className="absolute right-6 bottom-32 flex flex-col gap-6 items-center z-20">
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={() => setLikes(l => l + 1)}
              className="bg-black/40 p-4 rounded-full text-white hover:text-pink-400 hover:bg-black/60 backdrop-blur-md transition-colors group"
            >
              <Heart size={28} className="group-active:scale-150 transition-transform" />
            </button>
            <span className="text-white text-xs font-bold">{likes >= 1000 ? (likes/1000).toFixed(1) + 'k' : likes}</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <button className="bg-black/40 p-4 rounded-full text-white hover:text-blue-400 hover:bg-black/60 backdrop-blur-md transition-colors">
              <Share2 size={28} />
            </button>
            <span className="text-white text-xs font-bold">Share</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
              <Gift size={28} />
            </button>
            <span className="text-white text-xs font-bold">Gift</span>
          </div>
        </div>

      </div>

      {/* Sidebar: Chat & Product Detail Panel */}
      <div className={`w-[400px] bg-gray-900 border-l border-white/10 flex flex-col relative z-30 transition-transform duration-300 ${showProductFlyout ? 'translate-x-0' : 'translate-x-0'}`}>
        
        {/* Product Purchase Panel (Overlays chat when toggled) */}
        {showProductFlyout && (
          <div className="absolute inset-0 bg-gray-900 z-40 flex flex-col p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2"><ShoppingBag size={20} className="text-purple-400" /> Live Drop</h3>
              <button onClick={() => setShowProductFlyout(false)} className="text-white/60 hover:text-white">
                <AlertCircle size={24} className="rotate-45" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-6">
              <img src={featuredProduct.image} alt={featuredProduct.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-bold text-xl">{featuredProduct.name}</h4>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">${featuredProduct.price}</span>
                <span className="text-gray-500 line-through text-sm mb-1">${featuredProduct.originalPrice}</span>
              </div>
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                <AlertCircle size={16} /> Only {featuredProduct.stock} pairs left!
              </div>

              <button 
                onClick={() => {
                  addToCart(featuredProduct);
                  setShowProductFlyout(false);
                }}
                className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded-2xl transition-colors shadow-xl flex justify-center items-center gap-2"
              >
                Secure Now <ShoppingBag size={20} />
              </button>
            </div>

            <div className="flex-1 bg-gradient-to-b from-purple-900/20 to-transparent rounded-3xl border border-purple-500/20 p-6 flex flex-col items-center justify-center text-center">
              <Sparkles size={32} className="text-purple-400 mb-4" />
              <h4 className="text-white font-bold mb-2">Exclusive Live Pricing</h4>
              <p className="text-white/60 text-sm">This price is only available while the stream is active. Price returns to ${featuredProduct.originalPrice} after the broadcast ends.</p>
            </div>
          </div>
        )}

        {/* Live Chat Panel */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900/95 backdrop-blur-md">
          <h2 className="text-white font-bold flex items-center gap-2"><MessageCircle size={20} /> Live Chat</h2>
          <span className="text-green-400 text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Connected
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {chatLog.map((msg) => (
            <div key={msg.id} className="animate-fade-in flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.isCreator ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {msg.user.substring(0,2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${msg.isCreator ? 'text-purple-400' : 'text-gray-400'}`}>
                    {msg.user}
                  </span>
                  {msg.isCreator && <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Creator</span>}
                </div>
                <p className="text-white text-sm mt-0.5 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-900 border-t border-white/10">
          <form onSubmit={handleSendChat} className="relative">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Chat publicly..." 
              className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
            />
            <button type="submit" disabled={!chatMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 disabled:bg-gray-700 text-white p-2 rounded-full transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LiveCommerce;
