import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, SlidersHorizontal, Sparkles, TrendingUp, Zap, Star, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = ({ addToCart, wishlist, toggleWishlist, searchKeyword, setSearchKeyword }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories] = useState(['All', 'Electronics', 'Fashion', 'Home']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(false);
  
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      try {
        const { data } = await api.get('/search/recommendations?limit=4');
        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoadingRecs(false);
      }
    }
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        if (searchKeyword) {
          const { data } = await api.get('/search', {
            params: {
              q: searchKeyword,
              category: selectedCategory,
              sort,
              useAI
            }
          });
          setProducts(data.products || []);
          setPages(1);
        } else {
          const { data } = await api.get('/products', {
            params: {
              keyword: searchKeyword,
              category: selectedCategory,
              sort,
              page,
              limit: 12
            }
          });
          setProducts(data.products || []);
          setPages(data.pages || 1);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchKeyword, selectedCategory, sort, page, useAI]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchKeyword]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Hyper-Modern Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Abstract 3D-like background shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-tr from-purple-900/10 to-transparent rounded-full blur-3xl pointer-events-none"
        ></motion.div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest text-indigo-300 mb-8"
          >
            <Sparkles size={16} className="animate-pulse" /> The Future of Commerce
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
          >
            Elevate Your <br/> Lifestyle.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-400 max-w-2xl mb-12 font-medium"
          >
            Discover curated, premium collections powered by artificial intelligence. Shopping has never been this immersive.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="bg-white text-black px-10 py-5 rounded-full font-black text-lg flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
          >
            Explore Catalog <ArrowRight size={24} />
          </motion.button>
        </div>
      </section>

      {/* Recommended For You / Trending */}
      <section className="max-w-[1600px] mx-auto px-6 py-24 relative z-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              {localStorage.getItem('userInfo') ? 'Curated For You' : 'Trending Now'}
            </h2>
            <p className="text-gray-400 text-lg">Handpicked selections based on global trends and AI analytics.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>

        {loadingRecs ? (
          <div className="h-64 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-mono text-sm animate-pulse">Spark AI is analyzing preferences...</p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(rec => (
              <motion.div 
                key={`rec-${rec.product.id}`}
                whileHover={{ y: -10 }}
                className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-4 transition-all hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-6 left-6 z-10 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-md border border-indigo-400/50">
                  <Sparkles size={12} /> Top Pick
                </div>
                <ProductCard
                  product={rec.product}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  hideBorder={true}
                />
                <div className="mt-4 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 font-medium">
                  "{rec.reason}"
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-gray-400">Sign in for personalized AI recommendations.</p>
          </div>
        )}
      </section>

      {/* Main Catalog - Ultra Sleek */}
      <section className="max-w-[1600px] mx-auto px-6 py-24 border-t border-white/10 relative">
        {/* Lighting accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <h2 className="text-5xl font-black tracking-tight">The Collection</h2>
          
          {/* Minimalist Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {cat === 'Home' ? 'Home & Living' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer pr-4"
            >
              <option value="latest" className="bg-gray-900">Latest Drops</option>
              <option value="priceAsc" className="bg-gray-900">Price: Low to High</option>
              <option value="priceDesc" className="bg-gray-900">Price: High to Low</option>
              <option value="rating" className="bg-gray-900">Highest Rated</option>
            </select>
          </div>
        </div>

        {searchKeyword && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col md:flex-row justify-between items-center bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-3xl mb-12 backdrop-blur-md"
          >
            <div>
              <p className="text-gray-300 text-lg">Results for: <strong className="text-white text-xl">"{searchKeyword}"</strong></p>
              <button onClick={() => setSearchKeyword('')} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold mt-2 hover:underline">Clear Search</button>
            </div>
            
            <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/10 mt-4 md:mt-0">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400"/> AI Semantic Search
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={useAI} onChange={() => setUseAI(!useAI)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Collection...</p>
          </div>
        ) : error ? (
          <div className="p-12 bg-red-900/20 border border-red-500/30 text-red-400 rounded-3xl text-center backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-2">Error Loading Products</h3>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-24 text-center border border-white/5 rounded-3xl bg-white/[0.01]">
            <Search className="mx-auto text-gray-600 mb-6 w-16 h-16" />
            <h3 className="text-3xl font-black mb-4">No Matches Found</h3>
            <p className="text-gray-400 text-lg">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12"
            >
              {products.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <ProductCard
                    product={product}
                    addToCart={addToCart}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    isMinimal={true}
                  />
                  {product._explanation && (
                    <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-gray-400 font-medium leading-relaxed group-hover:border-indigo-500/30 transition-colors">
                      <Sparkles size={12} className="inline mr-2 text-indigo-400"/>
                      {product._explanation}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {pages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md transition-all"
            >
              Prev
            </button>
            <span className="font-mono text-gray-400">
              {page} / {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md transition-all"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-[1600px] mx-auto px-6 py-24 mb-20 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-3xl p-10 text-center hover:scale-[1.02] transition-transform">
            <Zap className="mx-auto text-indigo-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-3">Lightning Fast</h3>
            <p className="text-gray-400 font-medium">Powered by Next-Gen Edge Infrastructure for zero-latency browsing.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 rounded-3xl p-10 text-center hover:scale-[1.02] transition-transform">
            <ShieldCheck className="mx-auto text-purple-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-3">Military Grade Security</h3>
            <p className="text-gray-400 font-medium">Your data and transactions are encrypted via advanced blockchain protocols.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/20 rounded-3xl p-10 text-center hover:scale-[1.02] transition-transform">
            <Star className="mx-auto text-blue-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-3">Premium Quality</h3>
            <p className="text-gray-400 font-medium">Every product is verified for authenticity and superior craftsmanship.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
