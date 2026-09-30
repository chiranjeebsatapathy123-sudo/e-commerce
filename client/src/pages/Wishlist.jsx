import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = ({ wishlist, toggleWishlist, addToCart }) => {
  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page container animate-fade-in">
        <div className="empty-wishlist-state glass-panel empty-state">
          <Heart size={64} className="text-muted empty-icon" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h2 className="text-h2">Save products here when you find something you like.</h2>
          <p className="text-body text-muted" style={{ marginBottom: '24px' }}>Your wishlisted items will not expire.</p>
          <Link to="/" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container animate-fade-in">
      <h1>Your Wishlist</h1>
      <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-card glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <Link to={`/product/${product.id}`} className="wishlist-card-image-link" style={{ height: '200px', background: 'var(--bg)', position: 'relative' }}>
              <img src={product.image} alt={product.name} className="wishlist-card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="badge badge-success" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }}>Price Dropped!</span>
            </Link>
            
            <div className="wishlist-card-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span className="wishlist-card-category text-caption">{product.category}</span>
              <Link to={`/product/${product.id}`}>
                <h3 style={{ margin: '8px 0', fontSize: '1.1rem', lineHeight: 1.3 }}>{product.name}</h3>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div className="wishlist-card-price text-price">${parseFloat(product.price).toFixed(2)}</div>
                <div className="text-muted text-small" style={{ textDecoration: 'line-through' }}>${(parseFloat(product.price) * 1.2).toFixed(2)}</div>
              </div>
              
              <div className="wishlist-card-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                {product.stock > 0 ? (
                  <button onClick={() => addToCart(product)} className="btn btn-primary btn-sm flex-1">
                    Move to Cart
                  </button>
                ) : (
                  <span className="out-of-stock-badge-wish flex-1" style={{ textAlign: 'center' }}>Out of Stock</span>
                )}
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className="btn btn-secondary btn-sm delete-wishlist-btn"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
