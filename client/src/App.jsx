import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import LoginRegister from './pages/LoginRegister';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AiCopilot from './pages/AiCopilot';
import Compare from './pages/Compare';
import PersonalizationCenter from './pages/PersonalizationCenter';
import DecisionWorkspace from './pages/DecisionWorkspace';
import ShoppingRadar from './pages/ShoppingRadar';
import BackgroundEngine from './components/background/BackgroundEngine';
import SparkAIFab from './components/SparkAIFab';
import CommandPalette from './components/CommandPalette';
import { ToastProvider } from './components/ToastProvider';
import { io } from 'socket.io-client';
import './index.css';

// Initialize socket connection outside component so it doesn't reconnect on every render
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [liveActivity, setLiveActivity] = useState(null);

  useEffect(() => {
    socket.on('live_activity', (data) => {
      setLiveActivity(data);
      // clear after 5s
      setTimeout(() => setLiveActivity(null), 5000);
    });

    return () => {
      socket.off('live_activity');
    };
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsCommandPaletteOpen(true);
    document.addEventListener('open-command-palette', handleOpen);
    return () => document.removeEventListener('open-command-palette', handleOpen);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        const newQty = exists.quantity + quantity;
        if (newQty > product.stock) {
          alert(`Cannot add more items. Only ${product.stock} items remaining in stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateCartQty = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  return (
    <ToastProvider>
      <Router>
        <BackgroundEngine theme={theme} />
      <div className="app-layout">
        <Navbar
          userInfo={userInfo}
          logout={logout}
          cart={cart}
          wishlist={wishlist}
          theme={theme}
          toggleTheme={toggleTheme}
          onSearch={setSearchKeyword}
        />
        
        {liveActivity && (
          <div className="live-activity-ticker animate-fade-in" style={{
            background: 'var(--accent)', color: 'white', padding: '8px 16px', 
            textAlign: 'center', fontSize: '0.85rem', fontWeight: 500,
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
          }}>
            <span className="pulse-dot" style={{ background: 'white', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            {liveActivity}
          </div>
        )}

        <main className="main-content-area">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  searchKeyword={searchKeyword}
                  setSearchKeyword={setSearchKeyword}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetails
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  userInfo={userInfo}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartQty={updateCartQty}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <Wishlist
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                />
              }
            />
            <Route
              path="/compare"
              element={
                <Compare
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginRegister userInfo={userInfo} setUserInfo={setUserInfo} />
              }
            />
            <Route
              path="/checkout"
              element={
                <Checkout
                  userInfo={userInfo}
                  cart={cart}
                  clearCart={clearCart}
                />
              }
            />
            <Route path="/orders" element={<Orders userInfo={userInfo} />} />
            <Route
              path="/admin"
              element={<AdminDashboard userInfo={userInfo} />}
            />
            <Route
              path="/ai"
              element={
                <AiCopilot
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
            <Route path="/personalization" element={<PersonalizationCenter userInfo={userInfo} />} />
            <Route path="/workspace" element={<DecisionWorkspace userInfo={userInfo} addToCart={addToCart} />} />
            <Route path="/radar" element={<ShoppingRadar userInfo={userInfo} />} />
          </Routes>
        </main>
        <Footer />
        <SparkAIFab />
        <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} userInfo={userInfo} />
      </div>
    </Router>
    </ToastProvider>
  );
}

export default App;
