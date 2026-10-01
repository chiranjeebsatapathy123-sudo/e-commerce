import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Moon, Sun, LogOut, LayoutDashboard, Sparkles, Home, Mic, Camera, Settings, Activity, FolderKanban } from 'lucide-react';
import api from '../services/api';
import ImageSearchModal from './ImageSearchModal';

const Navbar = ({ userInfo, logout, cart, wishlist, theme, toggleTheme, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
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
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setKeyword(transcript);
      if (onSearch) onSearch(transcript);
      navigate('/');
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
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

  const isActive = (path) => location.pathname === path ? 'active' : '';
  
  const isCheckout = location.pathname.includes('/checkout');
  const isWorkspace = location.pathname.includes('/workspace') || location.pathname.includes('/ai');

  return (
    <>
      <header className={`navbar-header glass-panel ${isCheckout ? 'minimal' : ''}`}>
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo" onClick={() => { setKeyword(''); onSearch(''); }}>
            <span className="logo-spark">✨</span> SparkCart
          </Link>

          {!isCheckout && !isWorkspace && (
          <div className="navbar-search-container" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <form onSubmit={handleSearchSubmit} className="navbar-search" style={{ width: '100%', maxWidth: '100%', display: 'flex', alignItems: 'center', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0 8px' }}>
              <input
                type="search"
                placeholder="Search products, ask AI, or describe..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => document.getElementById('search-dropdown').style.display = 'block'}
                onBlur={() => setTimeout(() => document.getElementById('search-dropdown').style.display = 'none', 200)}
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', outline: 'none', color: 'var(--text)' }}
              />
              
              <button 
                type="button"
                className="search-icon-btn" 
                title="Voice Search"
                onClick={handleVoiceSearch}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: isListening ? 'var(--danger)' : 'var(--text-muted)' }}
              >
                <Mic size={18} className={isListening ? 'pulse-anim' : ''} />
              </button>
              
              <button 
                type="button"
                className="search-icon-btn" 
                title="Image Search"
                onClick={() => setIsImageSearchOpen(true)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-muted)' }}
              >
                <Camera size={18} />
              </button>

              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '4px' }}>
                <Search size={16} />
              </button>
            </form>
            
            <div id="search-dropdown" className="glass-panel" style={{ display: 'none', position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', padding: '16px', borderRadius: 'var(--radius-md)', zIndex: 'var(--z-dropdown)' }}>
              <div style={{ marginBottom: '16px' }}>
                <p className="text-small text-muted" style={{ marginBottom: '8px' }}>
                  {suggestions.length > 0 ? 'Smart Suggestions' : 'Popular Searches'}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {suggestions.length > 0 ? (
                    suggestions.map((s, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--bg)', cursor: 'pointer' }} onClick={() => { setKeyword(s); handleSearchSubmit(); }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="badge" style={{ background: 'var(--bg)', cursor: 'pointer' }} onClick={() => { setKeyword('Headphones'); handleSearchSubmit(); }}>Headphones</span>
                      <span className="badge" style={{ background: 'var(--bg)', cursor: 'pointer' }} onClick={() => { setKeyword('Shoes'); handleSearchSubmit(); }}>Shoes</span>
                      <span className="badge" style={{ background: 'var(--bg)', cursor: 'pointer' }} onClick={() => { setKeyword('Smartwatch'); handleSearchSubmit(); }}>Smartwatch</span>
                    </>
                  )}
                </div>
              </div>
              {suggestions.length === 0 && (
                <div>
                  <p className="text-small text-muted" style={{ marginBottom: '8px' }}>Category Suggestions</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }} className="hover-bg" onClick={() => { setKeyword('Electronics'); handleSearchSubmit(); }}>Electronics</li>
                    <li style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }} className="hover-bg" onClick={() => { setKeyword('Fashion'); handleSearchSubmit(); }}>Fashion</li>
                    <li style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }} className="hover-bg" onClick={() => { setKeyword('Home'); handleSearchSubmit(); }}>Home & Living</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          )}

          {!isCheckout && (
          <nav className="navbar-links">
            <button className="btn btn-secondary ai-btn" onClick={() => navigate('/ai')}>
              <Sparkles size={16} className="text-accent" /> Ask Spark AI
            </button>

            <button onClick={toggleTheme} className="theme-toggle-btn desktop-only" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} className="text-sun" /> : <Moon size={20} className="text-moon" />}
            </button>

            <Link to="/wishlist" className="nav-icon-link desktop-only" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="nav-badge badge-coral">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="nav-icon-link desktop-only" aria-label="Shopping Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="nav-badge badge-primary">{cartCount}</span>}
            </Link>

            {userInfo ? (
              <div className="user-menu-wrapper desktop-only">
                <div className="user-dropdown-container">
                  <button className="nav-text-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <User size={18} />
                    <span className="nav-user-name">{userInfo.name.split(' ')[0]}</span>
                  </button>
                  <div className="user-dropdown-menu glass-panel">
                    <Link to="/orders" className="dropdown-item">
                      <User size={16} /> My Orders
                    </Link>
                    <Link to="/personalization" className="dropdown-item">
                      <Settings size={16} /> Personalization
                    </Link>
                    <Link to="/workspace" className="dropdown-item">
                      <FolderKanban size={16} /> Decision Workspace
                    </Link>
                    <Link to="/radar" className="dropdown-item">
                      <Activity size={16} /> Shopping Radar
                    </Link>
                    {(userInfo.role === 'admin' || userInfo.role === 'Super Admin') && (
                      <Link to="/admin" className="dropdown-item">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={logout} className="dropdown-item text-danger">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary login-nav-btn desktop-only">
                Login
              </Link>
            )}
          </nav>
          )}
        </div>
      </header>

      <ImageSearchModal isOpen={isImageSearchOpen} onClose={() => setIsImageSearchOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav glass-panel">
        <Link to="/" className={`mobile-nav-item ${isActive('/')}`}>
          <Home size={22} />
          <span>Home</span>
        </Link>
        <button className="mobile-nav-item" onClick={() => navigate('/ai')}>
          <Sparkles size={22} className="text-accent" />
          <span className="text-accent">Spark AI</span>
        </button>
        <Link to="/wishlist" className={`mobile-nav-item ${isActive('/wishlist')}`}>
          <div className="mobile-icon-wrapper">
            <Heart size={22} />
            {wishlist.length > 0 && <span className="nav-badge badge-coral">{wishlist.length}</span>}
          </div>
          <span>Wishlist</span>
        </Link>
        <Link to="/cart" className={`mobile-nav-item ${isActive('/cart')}`}>
          <div className="mobile-icon-wrapper">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="nav-badge badge-primary">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </Link>
        {userInfo ? (
          <Link to="/orders" className={`mobile-nav-item ${isActive('/orders')}`}>
            <User size={22} />
            <span>Account</span>
          </Link>
        ) : (
          <Link to="/login" className={`mobile-nav-item ${isActive('/login')}`}>
            <User size={22} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
