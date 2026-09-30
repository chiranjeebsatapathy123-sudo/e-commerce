import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const Checkout = ({ userInfo, cart, clearCart }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else if (cart.length === 0 && step !== 3) {
      navigate('/cart');
    } else {
      setName(userInfo.name);
    }
  }, [userInfo, cart, navigate, step]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderItems = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const shippingAddress = { name, address, city, postalCode, country };

    try {
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod: 'Card',
        totalPrice: total
      });
      setPlacedOrder(data);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place your order. Check product stock levels.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && placedOrder) {
    return (
      <div className="checkout-page container animate-fade-in">
        <div className="success-confirmation-panel glass-panel" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-lg)' }}>
          <CheckCircle2 size={72} className="text-success success-icon pulse-anim" style={{ margin: '0 auto 24px', display: 'block' }} />
          <h1 style={{ marginBottom: '16px' }}>Order Placed Successfully!</h1>
          <p className="order-number-text">Thank you for shopping. Your order ID is: <strong>#{placedOrder.id}</strong></p>
          <p>We have received your payment. Our logistics center is processing your items for shipment.</p>
          
          <div className="receipt-summary">
            <h3>Receipt Summary</h3>
            <div className="receipt-row">
              <span>Delivery Status</span>
              <span className="badge badge-success">{placedOrder.status}</span>
            </div>
            <div className="receipt-row">
              <span>Total Paid</span>
              <strong>${parseFloat(placedOrder.total).toFixed(2)}</strong>
            </div>
            <div className="receipt-row">
              <span>Shipping Destination</span>
              <span>{placedOrder.address}, {placedOrder.city}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-primary">
              Track Order Status
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container animate-fade-in">
      <div className="checkout-step-tracker" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div className={`step-node ${step >= 1 ? 'text-primary' : 'text-muted'}`} style={{ fontWeight: step >= 1 ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
          01 Address
        </div>
        <div className="step-connector-line" style={{ flex: 1, height: '2px', background: step >= 2 ? 'var(--primary)' : 'var(--border)' }}></div>
        <div className={`step-node ${step >= 1 ? 'text-primary' : 'text-muted'}`} style={{ fontWeight: step >= 1 ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
          02 Delivery
        </div>
        <div className="step-connector-line" style={{ flex: 1, height: '2px', background: step >= 2 ? 'var(--primary)' : 'var(--border)' }}></div>
        <div className={`step-node ${step >= 2 ? 'text-primary' : 'text-muted'}`} style={{ fontWeight: step >= 2 ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
          03 Payment
        </div>
        <div className="step-connector-line" style={{ flex: 1, height: '2px', background: step >= 2 ? 'var(--primary)' : 'var(--border)' }}></div>
        <div className={`step-node ${step >= 2 ? 'text-primary' : 'text-muted'}`} style={{ fontWeight: step >= 2 ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
          04 Review
        </div>
        <div className="step-connector-line" style={{ flex: 1, height: '2px', background: step >= 3 ? 'var(--primary)' : 'var(--border)' }}></div>
        <div className={`step-node ${step >= 3 ? 'text-primary' : 'text-muted'}`} style={{ fontWeight: step >= 3 ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
          05 Confirmation
        </div>
      </div>

      <div className="checkout-grid">
        <div className="checkout-form-panel glass-panel">
          {error && <div className="form-error">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="checkout-step-form">
              <h2>Delivery Details</h2>
              
              <div className="input-group">
                <label htmlFor="shipping-name">Full Name</label>
                <input
                  id="shipping-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter recipient name"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="shipping-address">Street Address</label>
                <input
                  id="shipping-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, street name"
                  className="input-field"
                  required
                />
              </div>

              <div className="checkout-row-inputs">
                <div className="input-group flex-1">
                  <label htmlFor="shipping-city">City</label>
                  <input
                    id="shipping-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Boston"
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group flex-1">
                  <label htmlFor="shipping-postal">Postal Code</label>
                  <input
                    id="shipping-postal"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="02108"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="shipping-country">Country</label>
                <input
                  id="shipping-country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Continue to Payment <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="checkout-step-form">
              <h2>Card Payment Details</h2>
              
              <div className="security-guarantee">
                <ShieldCheck size={18} className="text-success" />
                <span>Secure payment. Your credentials are encrypted.</span>
              </div>

              <div className="input-group">
                <label htmlFor="card-num">Card Number</label>
                <input
                  id="card-num"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  placeholder="4000 1234 5678 9010"
                  maxLength="19"
                  className="input-field"
                  required
                />
              </div>

              <div className="checkout-row-inputs">
                <div className="input-group flex-1">
                  <label htmlFor="card-exp">Expiry Date</label>
                  <input
                    id="card-exp"
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group flex-1">
                  <label htmlFor="card-cvv">CVV</label>
                  <input
                    id="card-cvv"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    maxLength="3"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="payment-actions">
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                  Back
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                  {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="checkout-summary-panel glass-panel">
          <h2>Items Summary</h2>
          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <span>{item.name} <strong>x{item.quantity}</strong></span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          
          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
