import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
       <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         exit={{ opacity: 0 }}
         className="home-page"
       >
         {/* Amazon/Flipkart Style Hero Carousel Placeholder */}
          <section className="relative w-full max-w-[1500px] mx-auto bg-gray-100">
            <div className="w-full h-[300px] md:h-[450px] lg:h-[600px] relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
              <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-10">
                <span className="bg-yellow-400 text-black font-bold text-xs px-2 py-1 uppercase tracking-wider w-max mb-4">Great Spark Festival</span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white max-w-2xl leading-tight mb-4 shadow-sm">
                  Up to 70% Off on Top Electronics
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8">
                  Get the best deals on smartphones, laptops, and wearables. Limited time offer!
                </p>
                <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-sm w-max transition-colors text-lg">
                  Shop Now
                </button>
              </div>
              {/* Fade out bottom gradient mimicking Amazon */}
              <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
            </div>
          </section>

          {/* Flipkart/Amazon 4-Card Category Grids */}
          <section className="max-w-[1500px] mx-auto px-4 -mt-20 md:-mt-40 relative z-20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4 shadow-md rounded-sm h-[400px] flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Starting $99 | Top Rated Electronics</h3>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Headphones"/>
                    <span className="text-xs text-gray-700">Audio</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Watches"/>
                    <span className="text-xs text-gray-700">Wearables</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Laptops"/>
                    <span className="text-xs text-gray-700">Laptops</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Tablets"/>
                    <span className="text-xs text-gray-700">Tablets</span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 hover:text-red-500 text-sm mt-4 hover:underline">See more</a>
              </div>

              <div className="bg-white p-4 shadow-md rounded-sm h-[400px] flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Up to 60% off | Styles for Men</h3>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Clothing"/>
                    <span className="text-xs text-gray-700">Clothing</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Shoes"/>
                    <span className="text-xs text-gray-700">Footwear</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Watches"/>
                    <span className="text-xs text-gray-700">Watches</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Bags"/>
                    <span className="text-xs text-gray-700">Bags & Wallets</span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 hover:text-red-500 text-sm mt-4 hover:underline">End of season sale</a>
              </div>

              <div className="bg-white p-4 shadow-md rounded-sm h-[400px] flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Revamp your home in style</h3>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Furniture"/>
                    <span className="text-xs text-gray-700">Furniture</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Decor"/>
                    <span className="text-xs text-gray-700">Home Decor</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Storage"/>
                    <span className="text-xs text-gray-700">Storage</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=200&h=200&fit=crop" className="w-full h-[100px] object-cover" alt="Lighting"/>
                    <span className="text-xs text-gray-700">Lighting</span>
                  </div>
                </div>
                <a href="#" className="text-blue-600 hover:text-red-500 text-sm mt-4 hover:underline">Explore all</a>
              </div>

              <div className="bg-white p-4 shadow-md rounded-sm h-[400px] flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sign in for your best experience</h3>
                <button onClick={() => navigate('/login')} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black w-full py-2 rounded-md font-medium border border-[#fcd200] shadow-sm mb-2">Sign in securely</button>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                   <Sparkles className="text-indigo-500" size={16}/>
                   <span>Powered by Spark AI</span>
                </div>
              </div>
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

          {/* Horizontal Scroller: Blockbuster Deals */}
          <section className="max-w-[1500px] mx-auto px-4 mb-8">
            <div className="bg-white p-4 shadow-sm rounded-sm">
              <div className="flex items-end gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Blockbuster Deals</h2>
                <a href="#" className="text-blue-600 hover:text-red-500 hover:underline text-sm mb-1">See all deals</a>
              </div>
              <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 snap-x">
                {products.map((product) => (
                  <div key={`deal-${product.id}`} className="min-w-[200px] md:min-w-[250px] flex-shrink-0 snap-start">
                    <ProductCard
                      product={product}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Horizontal Scroller: New Arrivals */}
          <section className="max-w-[1500px] mx-auto px-4 mb-8">
            <div className="bg-white p-4 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
                <span className="bg-red-600 text-white text-xs px-2 py-1 uppercase font-bold">New</span>
              </div>
              <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 snap-x">
                {[...products].reverse().map((product) => (
                  <div key={`new-${product.id}`} className="min-w-[200px] md:min-w-[250px] flex-shrink-0 snap-start">
                    <ProductCard
                      product={product}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="catalog-section max-w-[1500px] mx-auto px-4 mb-16">
            <div className="bg-white p-4 shadow-sm rounded-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore All Products</h2>
              <div className="catalog-header border-b border-gray-200 pb-4 mb-6">
                <div className="category-tabs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`category-tab-btn ${selectedCategory === cat ? 'active bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                      style={{ padding: '8px 16px', fontWeight: '500' }}
                    >
                      {cat === 'Home' ? 'Home & Living' : cat}
                    </button>
                  ))}
                </div>

                <div className="sorting-and-filter">
                  <SlidersHorizontal size={18} className="text-gray-500" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="sort-select bg-gray-50 border border-gray-300 text-gray-700 py-1 px-2 rounded-sm"
                  >
                    <option value="latest">Latest Deals</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {searchKeyword && (
                <div className="search-result-info flex justify-between items-center bg-blue-50 border border-blue-100 p-4 rounded-sm mb-6 text-black">
                  <div>
                    <p className="m-0 text-gray-800">Showing search results for: <strong className="text-black">"{searchKeyword}"</strong></p>
                    <button onClick={() => setSearchKeyword('')} className="text-blue-600 hover:underline text-sm mt-1">Clear Search</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-indigo-700 flex items-center gap-1"><Sparkles size={14}/> Search with AI</span>
                    <label className="switch">
                      <input type="checkbox" checked={useAI} onChange={() => setUseAI(!useAI)} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="loading-spinner-wrapper py-20 text-black">
                  <div className="spinner border-t-blue-600"></div>
                  <p>Curating products...</p>
                </div>
              ) : error ? (
                <div className="error-state p-10 bg-red-50 text-red-600 rounded-sm">
                  <p>{error}</p>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state p-20 text-center text-gray-500">
                  <h3 className="text-xl font-medium mb-3 text-gray-800">We couldn't find products matching your search.</h3>
                  <p>Try checking your spelling or use more general terms.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="relative">
                        <ProductCard
                          product={product}
                          addToCart={addToCart}
                          wishlist={wishlist}
                          toggleWishlist={toggleWishlist}
                        />
                        {product._explanation && (
                          <div className="absolute bottom-2 left-2 right-2 bg-indigo-900/90 text-white p-2 rounded-sm text-xs z-10 backdrop-blur-sm border border-indigo-400">
                            <span className="text-yellow-400"><Sparkles size={12} className="inline mr-1"/></span>
                            {product._explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {pages > 1 && (
                    <div className="pagination-wrapper mt-10 border-t border-gray-200 pt-6 flex justify-center gap-4">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-800 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="pagination-info flex items-center text-gray-700">
                        Page {page} of {pages}
                      </span>
                      <button
                        disabled={page === pages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-800 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
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


        </motion.div>
     );
   };

   export default Home;
