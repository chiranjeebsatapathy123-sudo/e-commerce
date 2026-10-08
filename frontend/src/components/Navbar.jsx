import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, MapPin, Menu, Mic, Camera, LogOut, Sparkles, ChevronDown, Activity, FolderKanban, Settings, LayoutDashboard } from 'lucide-react';
import api from '../services/api';
import ImageSearchModal from './ImageSearchModal';

const Navbar = ({ userInfo, logout, cart, wishlist, theme, toggleTheme, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search isn't supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setKeyword(transcript);
      if (onSearch) onSearch(transcript);
      navigate('/');
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    if (keyword.length > 2) {
      const timer = setTimeout(async () => {
        try {
          const { data } = await api.get(`/search/suggestions?q=${keyword}`);
          setSuggestions(data.suggestions || []);
        } catch (e) {
          console.error('Failed to fetch suggestions', e);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [keyword]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (keyword.trim()) {
      if (onSearch) onSearch(keyword);
      navigate('/');
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isCheckout = location.pathname.includes('/checkout');

  if (isCheckout) {
    return (
      <header className="bg-[#050505] border-b border-white/10 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">SparkCart Secure Checkout</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => { setKeyword(''); if(onSearch) onSearch(''); }}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white hidden md:block">SparkCart</span>
          </Link>

          {/* Search Bar - Sleek Style */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus-within:bg-white/10 focus-within:border-indigo-500/50 transition-all group relative">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center h-12 relative pl-4">
              <Search size={18} className="text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search products, brands and categories..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-white px-3 py-2 outline-none font-medium placeholder-gray-500 text-sm"
              />
              {/* Intelligent Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 shadow-2xl rounded-2xl z-50 text-white overflow-hidden backdrop-blur-xl">
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => { setKeyword(s); handleSearchSubmit(); }} className="px-5 py-3 hover:bg-white/10 cursor-pointer text-sm font-medium transition-colors border-b border-white/5 last:border-0 flex items-center gap-3">
                      <Search size={14} className="text-gray-500" /> {s}
                    </div>
                  ))}
                </div>
              )}
            </form>
            <div className="flex items-center px-2 border-l border-white/10 h-8 gap-1">
              <button onClick={handleVoiceSearch} className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ${isListening ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`}>
                <Mic size={16} />
              </button>
              <button onClick={() => setIsImageSearchOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400">
                <Camera size={16} />
              </button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-2">
            
            {/* Account & Lists */}
            <div className="relative group p-2 rounded-xl cursor-pointer hidden md:flex items-center gap-3 hover:bg-white/5 transition-colors">
              <div className="w-9 h-9 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/30">
                <User size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">{userInfo ? 'Account' : 'Sign In'}</span>
                <span className="text-sm font-bold text-white leading-none flex items-center gap-1">{userInfo ? userInfo.name.split(' ')[0] : 'Guest'} <ChevronDown size={14} /></span>
              </div>
              
              {/* Mega Dropdown menu */}
              <div className="absolute top-full right-0 w-72 bg-[#111] border border-white/10 text-white shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all mt-4 p-6 backdrop-blur-xl">
                {!userInfo ? (
                  <div className="text-center pb-6 border-b border-white/10 mb-6">
                    <button onClick={() => navigate('/login')} className="w-full bg-white text-black font-black py-3 rounded-xl mb-3 hover:scale-105 transition-transform shadow-lg">Sign In</button>
                    <p className="text-xs text-gray-400">New customer? <Link to="/login" className="text-indigo-400 hover:underline">Start here</Link></p>
                  </div>
                ) : (
                  <div className="pb-6 border-b border-white/10 mb-6 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Signed In As</p>
                      <p className="font-bold">{userInfo.name}</p>
                    </div>
                    <button onClick={logout} className="w-8 h-8 bg-rose-500/20 text-rose-500 flex items-center justify-center rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                      <LogOut size={14}/>
                    </button>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Your Services</h4>
                    <ul className="text-sm font-medium space-y-3 text-gray-300">
                      <li><Link to="/orders" className="hover:text-white flex items-center gap-2"><FolderKanban size={16}/> Your Orders</Link></li>
                      <li><Link to="/wishlist" className="hover:text-white flex items-center gap-2"><Heart size={16}/> Wishlist</Link></li>
                      <li><Link to="/wallet" className="hover:text-indigo-400 text-indigo-300 flex items-center gap-2"><Activity size={16}/> Spark Wallet</Link></li>
                      <li><Link to="/rewards" className="hover:text-yellow-400 text-yellow-500 flex items-center gap-2"><Sparkles size={16}/> Rewards Hub</Link></li>
                      <li><Link to="/subscriptions" className="hover:text-rose-400 text-rose-500 flex items-center gap-2"><Settings size={16}/> Subscriptions</Link></li>
                    </ul>
                  </div>
                  
                  {userInfo?.role === 'admin' && (
                    <div className="pt-6 border-t border-white/10">
                      <Link to="/admin" className="w-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                        <LayoutDashboard size={16}/> Admin Panel
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={24} className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050505]">{cartCount}</span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Secondary Sub-Nav */}
        <div className="w-full border-t border-white/5 mt-4 md:mt-3 bg-black/20 overflow-x-auto hide-scrollbar">
          <div className="max-w-[1600px] mx-auto flex items-center gap-6 px-6 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap text-gray-400">
            <Link to="/ai" className="text-indigo-400 flex items-center gap-1.5 hover:text-indigo-300 transition-colors">
              <Sparkles size={14} /> Spark AI
            </Link>
            <Link to="/prime" className="text-yellow-400 hover:text-yellow-300 transition-colors">Spark Prime</Link>
            <Link to="/live" className="text-red-400 hover:text-red-300 transition-colors">Live Commerce</Link>
            <Link to="/auctions" className="hover:text-white transition-colors">Auctions</Link>
            <Link to="/mystery-box" className="text-emerald-400 hover:text-emerald-300 transition-colors">Mystery Boxes</Link>
            <Link to="/eco" className="hover:text-white transition-colors">Eco Hub</Link>
            <Link to="/wholesale" className="hover:text-white transition-colors">B2B</Link>
            <Link to="/gift-cards" className="text-pink-400 hover:text-pink-300 transition-colors">Gift Cards</Link>
            <Link to="/social" className="hover:text-white transition-colors">Social Feed</Link>
            <Link to="/spatial" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors">3D Spatial</Link>
            <Link to="/virtual-try-on" className="text-cyan-400 hover:text-cyan-300 transition-colors">AR Try-On</Link>
          </div>
        </div>
      </header>
      
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-32 md:h-28"></div>
      
      <ImageSearchModal isOpen={isImageSearchOpen} onClose={() => setIsImageSearchOpen(false)} />
    </>
  );
};

export default Navbar;
