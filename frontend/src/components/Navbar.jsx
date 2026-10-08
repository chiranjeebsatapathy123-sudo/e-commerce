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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const navigate = useNavigate();
  const location = useLocation();

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
      onSearch(keyword);
      navigate('/');
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isCheckout = location.pathname.includes('/checkout');

  if (isCheckout) {
    return (
      <header className="bg-gray-900 border-b border-white/10 py-4">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold text-white tracking-tight">SparkCart Checkout</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="w-full bg-[#131921] text-white">
        {/* Main Top Nav */}
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-2 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 hover:border hover:border-white border border-transparent p-2 rounded-sm transition-all" onClick={() => { setKeyword(''); onSearch(''); }}>
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold tracking-tight">SparkCart</span>
          </Link>

          {/* Delivery Location */}
          <div className="hidden md:flex items-center hover:border hover:border-white border border-transparent p-2 rounded-sm cursor-pointer">
            <MapPin className="w-5 h-5 text-gray-300 mt-2" />
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-300 leading-3">Deliver to</span>
              <span className="text-sm font-bold leading-4">Select your address</span>
            </div>
          </div>

          {/* Search Bar - Amazon Style */}
          <div className="flex-1 hidden md:flex items-center rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#f90]">
            <div className="relative group">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-3 border-r border-gray-300 flex items-center gap-1">
                {selectedCategory} <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex-1 flex relative">
              <input
                type="text"
                placeholder="Search SparkCart"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-black px-4 py-2 outline-none"
              />
              {/* Intelligent Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl rounded-b-md z-50 text-black">
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => { setKeyword(s); handleSearchSubmit(); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </form>
            <button onClick={handleVoiceSearch} className="px-3 text-gray-600 bg-white hover:bg-gray-100 border-l border-gray-200 h-full flex items-center">
              <Mic size={18} className={isListening ? 'text-red-500 animate-pulse' : ''} />
            </button>
            <button onClick={() => setIsImageSearchOpen(true)} className="px-3 text-gray-600 bg-white hover:bg-gray-100 border-l border-gray-200 h-full flex items-center">
              <Camera size={18} />
            </button>
            <button onClick={handleSearchSubmit} className="bg-[#febd69] hover:bg-[#f3a847] px-5 py-3 text-gray-900 transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-1">
            {/* Account & Lists */}
            <div className="relative group hover:border hover:border-white border border-transparent p-2 rounded-sm cursor-pointer hidden md:block z-50">
              <div className="flex flex-col">
                <span className="text-[11px] leading-3">Hello, {userInfo ? userInfo.name.split(' ')[0] : 'sign in'}</span>
                <span className="text-sm font-bold flex items-center gap-1 leading-4">Account & Lists <ChevronDown className="w-3 h-3" /></span>
              </div>
              
              {/* Mega Dropdown menu for Account */}
              <div className="absolute top-full right-0 w-[300px] bg-white text-black shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all mt-1 p-4 border border-gray-200">
                {!userInfo ? (
                  <div className="text-center pb-4 border-b border-gray-200 mb-4">
                    <button onClick={() => navigate('/login')} className="w-48 bg-gradient-to-t from-[#f0c14b] to-[#f7dfa5] border border-[#a88734] rounded-sm py-1 font-semibold text-sm hover:from-[#e4b335] mx-auto block">Sign in</button>
                    <p className="text-[11px] mt-2">New customer? <Link to="/login" className="text-blue-600 hover:underline hover:text-red-500">Start here.</Link></p>
                  </div>
                ) : (
                  <div className="text-center pb-4 border-b border-gray-200 mb-4 flex justify-between items-center">
                    <span className="font-semibold text-sm">Welcome back, {userInfo.name}</span>
                    <button onClick={logout} className="text-xs text-blue-600 hover:underline hover:text-red-500 flex items-center gap-1"><LogOut size={12}/> Sign out</button>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <div className="flex-1 border-r border-gray-200 pr-4">
                    <h4 className="font-bold text-sm mb-2">Your Lists</h4>
                    <ul className="text-[13px] space-y-2 text-gray-600">
                      <li><Link to="/wishlist" className="hover:text-[#e47911] hover:underline">Wishlist</Link></li>
                      <li><Link to="/personalization" className="hover:text-[#e47911] hover:underline">Personalized Picks</Link></li>
                    </ul>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-2">Your Account</h4>
                    <ul className="text-[13px] space-y-2 text-gray-600">
                      <li><Link to="/orders" className="hover:text-[#e47911] hover:underline">Your Orders</Link></li>
                      <li><Link to="/wallet" className="hover:text-[#e47911] hover:underline text-indigo-600 font-bold flex items-center gap-1">Spark Wallet</Link></li>
                      <li><Link to="/radar" className="hover:text-[#e47911] hover:underline">Shopping Radar</Link></li>
                      <li><Link to="/workspace" className="hover:text-[#e47911] hover:underline">Decision Workspace</Link></li>
                      {userInfo?.role === 'admin' && (
                        <li><Link to="/admin" className="hover:text-[#e47911] hover:underline font-semibold flex items-center gap-1"><LayoutDashboard size={12}/> Admin Panel</Link></li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns & Orders */}
            <Link to="/orders" className="hidden md:flex flex-col hover:border hover:border-white border border-transparent p-2 rounded-sm">
              <span className="text-[11px] leading-3">Returns</span>
              <span className="text-sm font-bold leading-4">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-end hover:border hover:border-white border border-transparent p-2 rounded-sm relative">
              <div className="relative">
                <ShoppingCart size={32} />
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-1 text-[#f3a847] font-bold text-sm">{cartCount}</span>
              </div>
              <span className="text-sm font-bold hidden md:inline ml-1">Cart</span>
            </Link>
          </div>
        </div>

        {/* Secondary Sub-Nav */}
        <div className="w-full bg-[#232f3e] text-white py-1 px-4 text-sm font-semibold flex items-center overflow-x-auto whitespace-nowrap hide-scrollbar">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4 w-full">
            <button className="flex items-center gap-1 hover:border hover:border-white border border-transparent p-1 rounded-sm">
              <Menu size={20} /> All
            </button>
            <Link to="/ai" className="flex items-center gap-1 hover:border hover:border-white border border-transparent p-1 rounded-sm text-[#f3a847]">
              <Sparkles size={16} /> Spark AI Copilot
            </Link>
            <Link to="/prime" className="hover:border hover:border-white border border-transparent p-1 rounded-sm text-yellow-400 font-bold">Spark Prime</Link>
            <Link to="/live" className="hover:border hover:border-white border border-transparent p-1 rounded-sm text-red-400 font-bold">Live Commerce</Link>
            <Link to="/auctions" className="hover:border hover:border-white border border-transparent p-1 rounded-sm text-indigo-400 font-bold">Auctions</Link>
            <Link to="/mystery-box" className="hover:border hover:border-white border border-transparent p-1 rounded-sm text-emerald-400 font-bold">Mystery Boxes</Link>
            <Link to="/group-buy" className="hover:border hover:border-white border border-transparent p-1 rounded-sm">Group Buy</Link>
            <Link to="/social" className="hover:border hover:border-white border border-transparent p-1 rounded-sm">Social Feed</Link>
            <Link to="/spatial" className="hover:border hover:border-white border border-transparent p-1 rounded-sm text-fuchsia-400 font-bold">3D Spatial</Link>
          </div>
        </div>
      </header>
      <ImageSearchModal isOpen={isImageSearchOpen} onClose={() => setIsImageSearchOpen(false)} />
    </>
  );
};

export default Navbar;
