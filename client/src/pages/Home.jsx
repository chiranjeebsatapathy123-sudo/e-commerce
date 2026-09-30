import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';

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
           // Use /api/search when searchKeyword is present
           if (searchKeyword) {
             const { data } = await api.get('/search', {
               params: {
                 q: searchKeyword,
                 category: selectedCategory,
                 sort,
                 useAI
               }
             });
             // Hybrid search endpoint returns { products: [] }
             setProducts(data.products);
             setPages(1); // Simple AI search might not paginate initially
           } else {
             const { data } = await api.get('/products', {
               params: {
                 keyword: searchKeyword,
                 category: selectedCategory,
                 sort,
                 page,
                 limit: 8
               }
             });
             setProducts(data.products);
             setPages(data.pages);
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
       <div className="home-page animate-fade-in">
         <section className="hero-banner glass-panel" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-hsl), 0.1) 0%, rgba(var(--panel-hsl), 0.8) 100%)' }}>
           <div className="hero-content">
             <span className="badge badge-coral">Welcome to the future</span>
             <h1>Shopping, powered by AI.</h1>
             <p>Discover personalized recommendations, smart deals, and find exactly what you need with Spark AI.</p>
             <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
               <button onClick={() => navigate('/ai-copilot')} className="btn btn-primary">
                 <Sparkles size={18} /> Ask Spark AI
               </button>
               <button onClick={() => {
                 setSelectedCategory('All');
                 window.scrollTo({ top: document.querySelector('.catalog-section').offsetTop - 100, behavior: 'smooth' });
               }} className="btn btn-secondary">
                 Explore Products
               </button>
             </div>
           </div>
           <div className="hero-image-wrapper">
             <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" alt="Featured sneakers" className="hero-image" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }} />
           </div>
         </section>

          {/* Personalized Section */}
          <section className="container" style={{ marginBottom: '48px' }}>
             <h2 className="text-h2" style={{ marginBottom: '24px' }}>
               {localStorage.getItem('userInfo') ? 'Recommended for You' : 'Popular Right Now'}
             </h2>
             {loadingRecs ? (
               <div className="glass-panel empty-state">Spark AI is analyzing your preferences...</div>
             ) : (
               <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                 {recommendations.length > 0 ? (
                   recommendations.map(rec => (
                     <div key={rec.product.id} style={{ position: 'relative' }}>
                       <ProductCard
                         product={rec.product}
                         addToCart={addToCart}
                         isWishlisted={wishlist.some((item) => item.id === rec.product.id)}
                         toggleWishlist={toggleWishlist}
                       />
                       <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                         {rec.reason}
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center' }}>
                     No recommendations available.
                   </div>
                 )}
               </div>
             )}
          </section>

          <section className="container" style={{ marginBottom: '48px' }}>
            <h2 className="text-h2" style={{ marginBottom: '24px' }}>New Arrivals</h2>
            <div className="glass-panel empty-state">Fresh products just landed.</div>
          </section>

          <section className="container" style={{ marginBottom: '48px' }}>
            <h2 className="text-h2" style={{ marginBottom: '24px' }}>Recently Viewed</h2>
            <div className="glass-panel empty-state">Your recent history will be displayed here.</div>
          </section>

          <section className="catalog-section container">
            <h2 className="text-h2" style={{ marginBottom: '24px' }}>Featured Products</h2>
           <div className="catalog-header">
             <div className="category-tabs">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                 >
                   {cat === 'Home' ? 'Home & Living' : cat}
                 </button>
               ))}
             </div>

             <div className="sorting-and-filter">
               <SlidersHorizontal size={18} className="text-muted" />
               <select
                 value={sort}
                 onChange={(e) => setSort(e.target.value)}
                 className="sort-select"
               >
                 <option value="latest">Latest Deals</option>
                 <option value="priceAsc">Price: Low to High</option>
                 <option value="priceDesc">Price: High to Low</option>
                 <option value="rating">Top Rated</option>
               </select>
             </div>
           </div>

           {searchKeyword && (
             <div className="search-result-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--panel)', padding: '16px 24px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }}>
               <div>
                 <p style={{ margin: 0 }}>Showing search results for: <strong>"{searchKeyword}"</strong></p>
                 <button onClick={() => setSearchKeyword('')} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>Clear Search</button>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span className="text-small">✨ Search with AI</span>
                 <label className="switch">
                   <input type="checkbox" checked={useAI} onChange={() => setUseAI(!useAI)} />
                   <span className="slider round"></span>
                 </label>
               </div>
             </div>
           )}

           {loading ? (
             <div className="loading-spinner-wrapper">
               <div className="spinner"></div>
               <p>Curating products...</p>
             </div>
           ) : error ? (
             <div className="error-state glass-panel">
               <p>{error}</p>
             </div>
           ) : products.length === 0 ? (
             <div className="empty-state glass-panel">
               <h3 className="text-h3" style={{ marginBottom: '12px' }}>We couldn't find products matching your search.</h3>
             </div>
           ) : (
             <>
               <div className="product-grid">
                 {products.map((product) => (
                   <div key={product.id} style={{ position: 'relative' }}>
                     <ProductCard
                       product={product}
                       addToCart={addToCart}
                       wishlist={wishlist}
                       toggleWishlist={toggleWishlist}
                     />
                     {product._explanation && (
                       <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(var(--panel-hsl), 0.95)', padding: '8px', borderRadius: '4px', fontSize: '0.8rem', zIndex: 2, backdropFilter: 'blur(4px)', border: '1px solid var(--border)' }}>
                         <span style={{ color: 'var(--primary)' }}><Sparkles size={12} style={{ marginRight: '4px' }}/></span>
                         {product._explanation}
                       </div>
                     )}
                   </div>
                 ))}
               </div>

               {pages > 1 && (
                 <div className="pagination-wrapper">
                   <button
                     disabled={page === 1}
                     onClick={() => setPage((prev) => prev - 1)}
                     className="btn btn-secondary pagination-btn"
                   >
                     Previous
                   </button>
                   <span className="pagination-info">
                     Page {page} of {pages}
                   </span>
                   <button
                     disabled={page === pages}
                     onClick={() => setPage((prev) => prev + 1)}
                     className="btn btn-secondary pagination-btn"
                   >
                     Next
                   </button>
                 </div>
               )}
             </>
           )}
         </section>

          {/* Trust / Delivery / Returns */}
          <section className="container" style={{ padding: '48px 24px', display: 'flex', gap: '24px', justifyContent: 'space-around', flexWrap: 'wrap', borderTop: '1px solid var(--border)', marginTop: '48px' }}>
            <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
              <h3 className="text-h3">Free Shipping</h3>
              <p className="text-small">On all orders over $50</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
              <h3 className="text-h3">Secure Payment</h3>
              <p className="text-small">100% secure checkout</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
              <h3 className="text-h3">Easy Returns</h3>
              <p className="text-small">30-day return policy</p>
            </div>
          </section>

          <footer style={{ padding: '48px 24px', background: 'var(--panel)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
             <p className="text-small">© 2026 Spark Commerce. All rights reserved.</p>
          </footer>
       </div>
     );
   };

   export default Home;
