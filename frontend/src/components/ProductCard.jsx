import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';

import HolographicCard from './HolographicCard';

const ProductCard = ({ product, addToCart, wishlist = [], toggleWishlist }) => {
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <HolographicCard>
      <div className="product-card glass-panel animate-scale-in">
        <Link to={`/product/${product.id}`} className="product-card-link">
          <div className="product-card-image-wrapper">
            <img src={product.image} alt={product.name} className="product-card-image" />
            <button 
              onClick={handleWishlistClick} 
              className={`wishlist-card-btn ${isWishlisted ? 'active' : ''}`}
              aria-label="Toggle Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="product-card-content">
            <span className="product-card-category">{product.category}</span>
            <h3 className="product-card-title">{product.name}</h3>
            
            <div className="product-card-rating">
              <div className="stars-wrapper">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating} ({product.reviewsCount})</span>
            </div>

            <div className="product-card-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="product-card-price text-price">${parseFloat(product.price).toFixed(2)}</span>
                <span className="text-muted text-small" style={{ textDecoration: 'line-through' }}>${(parseFloat(product.price) * 1.2).toFixed(2)}</span>
                <span className="badge badge-success" style={{ padding: '2px 6px', fontSize: '0.7rem', marginBottom: 0 }}>20% OFF</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-caption" style={{ color: 'var(--warning)' }}>Only {product.stock} left</span>
                )}
                {product.stock >= 10 && (
                  <span className="text-caption" style={{ color: 'var(--success)' }}>In Stock</span>
                )}
                {product.stock > 0 ? (
                  <button onClick={handleCartClick} className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: 'auto' }} title="Add to Cart">
                    <ShoppingCart size={14} /> Quick Add
                  </button>
                ) : (
                  <span className="out-of-stock-badge" style={{ marginLeft: 'auto' }}>Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </HolographicCard>
  );
};

export default ProductCard;
