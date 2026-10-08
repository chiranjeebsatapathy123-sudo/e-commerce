import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, ShoppingCart, Heart, MessageSquarePlus, ArrowLeft, Sparkles, Maximize2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
import ProductUniverse from '../components/ProductUniverse';
import Product3DViewer from '../components/Product3DViewer';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = ({ addToCart, wishlist, toggleWishlist, userInfo }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  
  const [aiReviewSummary, setAiReviewSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askAnswer, setAskAnswer] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setActiveImage(data.image);

        const relatedRes = await api.get(`/products/${id}/similar`);
        setRelatedProducts(relatedRes.data.products);
        
        // Fetch AI Review Summary
        try {
          setLoadingSummary(true);
          const summaryRes = await api.get(`/products/${id}/review-summary`);
          setAiReviewSummary(summaryRes.data.analysis);
        } catch (e) {
          console.error("AI summary error", e);
        } finally {
          setLoadingSummary(false);
        }
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review posted successfully!');
      setComment('');
      setRating(5);

      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner-wrapper">
        <div className="spinner"></div>
        <p>Curating details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
        <Link to="/" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        <div className="error-state glass-panel">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const imageList = product.images ? product.images.split(',') : [product.image];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="product-details-page container"
    >
      <Helmet>
        <title>{product.name} | Spark E-Commerce</title>
        <meta name="description" content={product.description.substring(0, 150) + '...'} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.substring(0, 150) + '...'} />
        <meta property="og:image" content={product.image} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="USD" />
      </Helmet>

      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <ProductGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        images={imageList} 
        initialIndex={imageList.indexOf(activeImage)} 
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-4 bg-white text-black p-6 rounded-lg shadow-sm">
        {/* Left Column: Images */}
        <div className="w-full lg:w-1/3 flex flex-col-reverse lg:flex-row gap-4 relative">
          {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
          <div className="flex lg:flex-col gap-2 overflow-auto hide-scrollbar w-full lg:w-16">
            {imageList.map((imgUrl, index) => (
              <button
                key={index}
                onMouseEnter={() => setActiveImage(imgUrl)}
                onClick={() => setActiveImage(imgUrl)}
                className={`flex-shrink-0 w-12 h-12 border-2 rounded-sm overflow-hidden ${activeImage === imgUrl ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative bg-white border border-gray-100 flex items-center justify-center p-4 rounded-md cursor-crosshair min-h-[400px]">
            {is3DMode ? (
              <div className="w-full h-full min-h-[400px]">
                <Product3DViewer fallbackColor="#4F46E5" />
              </div>
            ) : (
              <motion.img 
                layoutId={`product-image-${product.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={activeImage} alt={product.name} className="w-full max-h-[500px] object-contain" onClick={() => setIsGalleryOpen(true)} 
              />
            )}
            <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-gray-100 rounded-full text-gray-600 border border-gray-200" onClick={() => setIsGalleryOpen(true)}>
              <Maximize2 size={20} />
            </button>
            <button 
              onClick={() => setIs3DMode(!is3DMode)}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-50"
            >
              <Sparkles size={16} className="text-indigo-500" /> {is3DMode ? 'Close 3D' : 'View in 3D'}
            </button>
          </div>
        </div>

        {/* Center Column: Product Details */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 leading-tight">{product.name}</h1>
            <a href="#" className="text-blue-600 hover:underline text-sm mt-1 block">Visit the SparkStore</a>
          </div>

          <div className="flex items-center gap-4 text-sm border-b border-gray-200 pb-2">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating) ? "currentColor" : "none"} className={i < Math.round(product.rating) ? "" : "text-gray-300"} />
              ))}
              <span className="text-blue-600 ml-2 hover:underline cursor-pointer">{product.reviewsCount} ratings</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600 cursor-pointer hover:underline">Search this page</span>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-3xl font-light">-15%</span>
              <span className="text-3xl font-medium text-gray-900"><span className="text-sm align-top">$</span>{parseFloat(product.price).toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">Typical price: <span className="line-through">${(parseFloat(product.price) * 1.15).toFixed(2)}</span></p>
          </div>

          {/* AI Insights replacing simple description temporarily */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 my-2">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
              <Sparkles size={16} /> Spark AI Insights
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Key Specs */}
          <div className="text-sm text-gray-800">
            <h3 className="font-bold text-base mb-2">About this item</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>High-quality materials ensure durability and longevity.</li>
              <li>Sleek, modern design that fits perfectly in any environment.</li>
              <li>Optimized for maximum performance and user satisfaction.</li>
              <li>Backed by a 1-year manufacturer warranty.</li>
            </ul>
          </div>
          
          <div className="flex gap-2 mt-4">
             <button
              onClick={() => {
                const currentCompare = JSON.parse(localStorage.getItem('compareIds') || '[]');
                if (!currentCompare.includes(product.id)) {
                  if (currentCompare.length >= 4) {
                    alert('You can only compare up to 4 products.');
                    return;
                  }
                  currentCompare.push(product.id);
                  localStorage.setItem('compareIds', JSON.stringify(currentCompare));
                }
                navigate('/compare');
              }}
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              <Sparkles size={14} /> Compare with similar items
            </button>
          </div>
        </div>

        {/* Right Column: Buy Box */}
        <div className="w-full lg:w-[300px] border border-gray-300 rounded-lg p-4 self-start bg-white shadow-sm flex flex-col gap-4">
          <div className="text-3xl font-medium text-gray-900"><span className="text-sm align-top">$</span>{parseFloat(product.price).toFixed(2)}</div>
          
          <div className="text-sm text-gray-600">
            <span>Delivery </span>
            <span className="font-bold text-black">Thursday, Oct 12</span>
            <p className="mt-1">Order within <span className="text-green-600">12 hrs 30 mins</span></p>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer">
            <MapPin size={16} className="text-gray-600"/> Deliver to your default location
          </div>

          <h3 className={`text-lg font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </h3>

          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="qty">Qty:</label>
            <select id="qty" className="border border-gray-300 rounded-md bg-gray-100 py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button onClick={() => addToCart(product)} disabled={product.stock === 0} className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-full font-medium shadow-sm border border-[#fcd200] disabled:opacity-50">
              Add to Cart
            </button>
            <button onClick={() => { addToCart(product); navigate('/checkout'); }} disabled={product.stock === 0} className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-black py-2 rounded-full font-medium shadow-sm border border-[#ff8f00] disabled:opacity-50">
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-500 mt-2">
            <span>Ships from</span>
            <span>SparkCart Fulfillment</span>
            <span>Sold by</span>
            <span className="text-blue-600 hover:underline cursor-pointer">SparkCart Verified</span>
            <span>Returns</span>
            <span className="text-blue-600 hover:underline cursor-pointer">Eligible for Return</span>
          </div>

          <div className="border-t border-gray-200 mt-2 pt-4 flex flex-col gap-3">
             <button
                onClick={() => toggleWishlist(product)}
                className="w-full bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} className={isWishlisted ? 'text-red-500' : 'text-gray-600'} /> 
                {isWishlisted ? 'In Wishlist' : 'Add to List'}
              </button>
          </div>
        </div>
      </div>

      <section className="product-ai-assistant-section" style={{ marginTop: '24px', padding: '24px', background: 'linear-gradient(135deg, rgba(var(--primary-hsl), 0.05) 0%, rgba(var(--accent), 0.05) 100%)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(var(--primary-hsl), 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary)' }}>
          <Sparkles size={20} />
          <h3 style={{ margin: 0 }}>Ask Spark AI about this product</h3>
        </div>
        <p className="text-body text-muted" style={{ marginBottom: '16px' }}>Got questions? Our AI can read the details and help you decide.</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" style={{ background: 'var(--bg)' }}>Is this good for students?</button>
          <button className="btn btn-secondary btn-sm" style={{ background: 'var(--bg)' }}>What are its main features?</button>
          <button className="btn btn-secondary btn-sm" style={{ background: 'var(--bg)' }}>Show me alternatives.</button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Link to="/ai" className="btn btn-primary btn-sm">Chat with Spark AI</Link>
        </div>
      </section>

      <section className="product-specifications-section" style={{ marginTop: '48px', padding: '32px', background: 'var(--panel)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <h2 style={{ marginBottom: '24px' }}>Specifications</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}><span className="text-muted text-small">Brand</span><span className="text-body">Spark</span></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}><span className="text-muted text-small">Category</span><span className="text-body">{product.category}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}><span className="text-muted text-small">SKU</span><span className="text-body">SPK-{product.id.toString().padStart(6, '0')}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}><span className="text-muted text-small">Condition</span><span className="text-body">New</span></div>
        </div>
      </section>

      {/* Find Similar AI Section */}
      <section className="similar-products-section" style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="text-h2">Similar to this</h2>
          <button onClick={() => window.scrollTo(0,0)} className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} /> AI Matching
          </button>
        </div>
        <ProductUniverse currentProduct={product} relatedProducts={relatedProducts} />
      </section>

      <section className="ask-product-section" style={{ marginTop: '48px' }}>
        <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(var(--primary-hsl), 0.05) 0%, rgba(var(--panel-hsl), 1) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Sparkles size={24} className="text-primary" />
            <h2 className="text-h2" style={{ margin: 0 }}>Ask about this product</h2>
          </div>
          <p className="text-muted" style={{ marginBottom: '24px' }}>Got a specific question? Spark AI will answer using verified product details and customer reviews.</p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!askQuestion.trim()) return;
            setAskLoading(true);
            setAskAnswer(null);
            try {
              const res = await api.post(`/products/${id}/ask`, { question: askQuestion });
              setAskAnswer(res.data);
            } catch (err) {
              setAskAnswer({ error: "Failed to get answer. Please try again." });
            } finally {
              setAskLoading(false);
            }
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Is this suitable for college?" 
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={askLoading || !askQuestion.trim()}>
                {askLoading ? 'Asking...' : 'Ask'}
              </button>
            </div>
          </form>

          {askAnswer && (
            <div style={{ marginTop: '24px', padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              {askAnswer.error ? (
                <p className="text-danger">{askAnswer.error}</p>
              ) : (
                <>
                  <p style={{ fontWeight: '500', marginBottom: '12px' }}>{askAnswer.answer}</p>
                  {askAnswer.evidence && askAnswer.evidence.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Evidence:</strong>
                      <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
                        {askAnswer.evidence.map((ev, i) => <li key={i}>"{ev}"</li>)}
                      </ul>
                    </div>
                  )}
                  {askAnswer.missingInformation && askAnswer.missingInformation.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '8px' }}>
                      <strong>Note:</strong> Could not verify: {askAnswer.missingInformation.join(', ')}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="reviews-section" style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2>Reviews & Ratings</h2>
        </div>
        
        {product.Reviews && product.Reviews.length > 0 && (
          <div className="ai-review-summary glass-panel" style={{ marginBottom: '24px', padding: '20px', borderRadius: 'var(--radius-lg)', background: 'rgba(var(--accent), 0.05)', border: '1px solid rgba(var(--accent), 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent)', fontWeight: '600' }}>
              <Sparkles size={20} />
              <span>AI Review Summary</span>
            </div>
            
            {loadingSummary ? (
              <p className="text-muted">Analyzing customer feedback...</p>
            ) : aiReviewSummary && !aiReviewSummary.insufficientData ? (
              <div className="ai-summary-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  {aiReviewSummary.summary?.positive?.length > 0 && (
                    <div>
                      <h4 style={{ color: 'var(--success)', marginBottom: '8px', fontSize: '0.9rem' }}>What customers like</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {aiReviewSummary.summary.positive.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                  )}
                  {aiReviewSummary.summary?.negative?.length > 0 && (
                    <div>
                      <h4 style={{ color: 'var(--danger)', marginBottom: '8px', fontSize: '0.9rem' }}>Common concerns</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {aiReviewSummary.summary.negative.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                
                {aiReviewSummary.themes && Object.keys(aiReviewSummary.themes).length > 0 && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Mentioned Themes</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Object.entries(aiReviewSummary.themes).map(([theme, pct]) => (
                        <div key={theme} className="badge" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
                          {theme}: <span style={{ color: 'var(--primary)' }}>{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Based on {aiReviewSummary.analyzedReviewCount || product.reviewsCount} customer reviews.
                </div>
              </div>
            ) : (
              <p className="text-muted text-small">Not enough customer reviews for a reliable AI summary yet.</p>
            )}
          </div>
        )}
        <div className="reviews-grid">
          <div className="reviews-list-panel glass-panel">
            {product.Reviews && product.Reviews.length > 0 ? (
              product.Reviews.map((rev) => (
                <div key={rev.id} className="review-item">
                  <div className="review-header">
                    <strong>{rev.User?.name || 'Anonymous User'}</strong>
                    <div className="stars-wrapper">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="empty-reviews-text">No reviews yet for this product. Be the first to share your thoughts!</p>
            )}
          </div>

          <div className="add-review-panel glass-panel">
            <h3>Write a Review</h3>
            {userInfo ? (
              <form onSubmit={handleReviewSubmit} className="add-review-form">
                {reviewError && <div className="form-error">{reviewError}</div>}
                {reviewSuccess && <div className="form-success">{reviewSuccess}</div>}

                <div className="input-group">
                  <label htmlFor="rating-select">Rating</label>
                  <select
                    id="rating-select"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="input-field"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="comment-text">Your Comment</label>
                  <textarea
                    id="comment-text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field"
                    rows="4"
                    placeholder="Describe your experience with this product..."
                    required
                  ></textarea>
                </div>

                <button type="submit" disabled={reviewLoading} className="btn btn-primary">
                  <MessageSquarePlus size={18} /> {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="login-to-review">
                <p>Please log in to submit a rating and review for this product.</p>
                <Link to="/login" className="btn btn-secondary">Login Account</Link>
              </div>
            )}
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default ProductDetails;
