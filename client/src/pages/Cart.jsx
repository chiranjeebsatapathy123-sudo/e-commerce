import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const Cart = ({ cart, removeFromCart, updateCartQty }) => {
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Check if any item is out of stock or exceeds stock
    const invalidItems = cart.filter(item => item.quantity > item.stock);
    if (invalidItems.length > 0) {
      alert(`Cannot proceed. ${invalidItems[0].name} only has ${invalidItems[0].stock} units available.`);
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page container animate-fade-in">
        <div className="empty-cart-state glass-panel empty-state">
          <ShoppingBag size={64} className="text-muted empty-icon" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h2 className="text-h2">Your cart is waiting for something great.</h2>
          <p className="text-body text-muted" style={{ marginBottom: '24px' }}>Explore our premium catalog to add item collections to your bag.</p>
          <Link to="/" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fade-in">
      <h1>Your Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items-panel glass-panel">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="cart-item-title-link">
                  <h3>{item.name}</h3>
                </Link>
                <span className="cart-item-category">{item.category}</span>
                <span className="cart-item-price-unit">${parseFloat(item.price).toFixed(2)} each</span>
              </div>

              <div className="cart-item-qty-controls">
                <button 
                  onClick={() => updateCartQty(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button 
                  onClick={() => updateCartQty(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="cart-item-subtotal">
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="cart-item-delete-btn"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary-panel glass-panel">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="shipping-hint">Add <strong>${(150 - subtotal).toFixed(2)}</strong> more for Free Shipping!</p>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button onClick={handleCheckout} className="btn btn-primary btn-lg btn-block checkout-btn">
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
      
      {/* AI Cart Assistant - Phase 6 */}
      <div className="ai-cart-assistant glass-panel animate-fade-in" style={{ marginTop: '32px', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Sparkles size={24} className="text-primary" />
          <h3>Spark AI Recommendations</h3>
        </div>
        <p className="text-muted" style={{ marginBottom: '16px' }}>Based on your cart, you might also like these accessories:</p>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Complete your setup</button>
          <button className="btn btn-secondary" onClick={() => navigate('/ai')}>Ask AI for alternatives</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
