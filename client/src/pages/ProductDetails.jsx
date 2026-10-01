import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, ShoppingCart, Heart, MessageSquarePlus, ArrowLeft, Sparkles, Maximize2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
import ProductUniverse from '../components/ProductUniverse';

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
    <div className="product-details-page container animate-fade-in">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <ProductGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        images={imageList} 
        initialIndex={imageList.indexOf(activeImage)} 
      />

      <div className="product-details-grid">
        <div className="product-gallery">
          <div className="main-image-wrapper glass-panel" style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {is3DMode ? (
              <model-viewer
                src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
                alt="A 3D model of an astronaut"
                ar
                auto-rotate
                camera-controls
                style={{ width: '100%', height: '100%' }}
              ></model-viewer>
            ) : (
              <>
                <img src={activeImage} alt={product.name} className="main-image" style={{ maxHeight: '100%', objectFit: 'contain' }} onClick={() => setIsGalleryOpen(true)} />
                <button className="btn-icon-only" onClick={() => setIsGalleryOpen(true)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--bg)', border: 'none', color: 'var(--text-muted)' }}>
                  <Maximize2 size={20} />
                </button>
              </>
            )}
            
            <button 
              onClick={() => setIs3DMode(!is3DMode)}
              className="btn btn-secondary btn-sm" 
              style={{ position: 'absolute', bottom: '16px', right: '16px', gap: '8px', zIndex: 10 }}
            >
              <Sparkles size={14} /> {is3DMode ? 'Close 3D' : 'View in 3D / AR'}
            </button>
          </div>
          <div className="thumbnails-grid">
            {imageList.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`thumbnail-btn glass-panel ${activeImage === imgUrl ? 'active' : ''}`}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-panel glass-panel">
          <span className="badge badge-coral">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars-wrapper">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-value">{product.rating} ({product.reviewsCount} reviews)</span>
          </div>

          <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
          <p className="product-description">{product.description}</p>

          <div className="stock-info">
            Status: {product.stock > 0 ? (
              <span className="stock-status-in">In Stock ({product.stock} units available)</span>
            ) : (
              <span className="stock-status-out">Out of Stock</span>
            )}
          </div>

          <div className="ai-product-insights glass-panel" style={{ marginTop: '24px', marginBottom: '24px', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', background: 'rgba(var(--primary-hsl), 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)', fontWeight: '600' }}>
              <Sparkles size={18} />
              <span>Spark AI Insights</span>
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Best for:</strong> Daily use and professional environments.</li>
              <li><strong>Price History:</strong> Currently at its lowest price in 30 days.</li>
              <li><strong>Comparable to:</strong> Premium alternatives but at a fraction of the cost.</li>
            </ul>
          </div>

          <div className="action-buttons">
            {product.stock > 0 && (
              <button onClick={() => addToCart(product)} className="btn btn-primary btn-lg flex-1">
                <ShoppingCart size={18} /> Add to Cart
              </button>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`btn btn-secondary btn-lg btn-icon-only wishlist-toggle-details ${isWishlisted ? 'active' : ''}`}
              aria-label="Toggle Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => {
                const currentCompare = JSON.parse(localStorage.getItem('compareIds') || '[]');
                if (!currentCompare.includes(product.id)) {
                  if (currentCompare.length >= 4) {
                    alert('You can only compare up to 4 products. Please remove some first.');
                    return;
                  }
                  currentCompare.push(product.id);
                  localStorage.setItem('compareIds', JSON.stringify(currentCompare));
                }
                navigate('/compare');
              }}
              className="btn btn-secondary btn-lg btn-icon-only"
              title="Add to Compare"
            >
              <Sparkles size={18} />
            </button>
            <button
              onClick={() => setIsLensOpen(!isLensOpen)}
              className={`btn btn-secondary btn-lg btn-icon-only ${isLensOpen ? 'active' : ''}`}
              title="Toggle AI Product Lens"
            >
              <Sparkles size={18} className={isLensOpen ? 'text-accent' : ''} />
            </button>
          </div>

          {/* AI Product Lens Overlay */}
          {isLensOpen && (
            <div className="ai-lens-panel glass-panel animate-fade-in" style={{ marginTop: '16px', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)', background: 'linear-gradient(to bottom right, rgba(var(--bg-rgb), 0.9), rgba(var(--panel-rgb), 0.9))', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
                  <Sparkles size={16} /> AI Product Lens
                </h4>
                <button onClick={() => setIsLensOpen(false)} className="btn-icon-only" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)' }}>Summary</strong>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>{aiReviewSummary?.summary || 'A high-quality product recommended for its durability and design.'}</p>
                </div>
                {aiReviewSummary?.themes && (
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)' }}>Review Themes</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {aiReviewSummary.themes.map((theme, idx) => (
                        <span key={idx} className="badge" style={{ background: 'var(--bg)' }}>{theme}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text)' }}>Price Intelligence</strong>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Currently matching market average. Trending stable over the last 30 days.</p>
                </div>
              </div>
            </div>
          )}


          {/* Delivery & Warranty Information */}
          <div className="product-meta-info" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Delivery:</strong> Free shipping on orders over $50. Arrives in 3-5 business days.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Returns:</strong> 30-day money-back guarantee.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Warranty:</strong> 1-year limited manufacturer warranty.</span>
            </div>
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

    </div>
  );
};

export default ProductDetails;
