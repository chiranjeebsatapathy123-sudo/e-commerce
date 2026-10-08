import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { io } from 'socket.io-client';
import { useWallet } from '../contexts/WalletContext';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

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
  
  const { walletAddress, connectWallet } = useWallet();

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
      
      // Emit live activity
      if (orderItems.length > 0) {
        socket.emit('activity', `Someone in ${city || 'your area'} just bought ${orderItems[0].name}!`);
      }

      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place your order. Check product stock levels.');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      await connectWallet();
      if (!walletAddress) return; // if user canceled connection
    }

    setLoading(true);
    setError('');

    // Simulate smart contract payment request
    setTimeout(async () => {
      try {
        const orderItems = cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }));
        
        const shippingAddress = { name, address, city, postalCode, country };

        const { data } = await api.post('/orders', {
          orderItems,
          shippingAddress,
          paymentMethod: 'Crypto (Web3)',
          totalPrice: total
        });
        
        setPlacedOrder(data);
        if (orderItems.length > 0) {
          socket.emit('activity', `Someone in ${city || 'your area'} just bought ${orderItems[0].name} using Crypto!`);
        }
        clearCart();
        setStep(3);
      } catch (err) {
        setError(err.response?.data?.message || 'Crypto payment failed.');
      } finally {
        setLoading(false);
      }
    }, 2000); // simulated block confirmation delay
  };

  if (step === 3 && placedOrder) {
    return (
      <div className="bg-gray-100 min-h-screen pt-10 pb-20">
        <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-300 rounded-sm shadow-sm text-center">
          <CheckCircle2 size={64} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl text-green-700 font-bold mb-2">Order placed, thank you!</h1>
          <p className="text-gray-700 mb-6">Confirmation will be sent to your email.</p>
          
          <div className="border border-gray-200 rounded-md p-4 text-left mb-6 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Order details</h3>
            <p className="mb-2"><span className="text-gray-600 font-medium w-32 inline-block">Order ID:</span> <span className="font-mono">{placedOrder.id}</span></p>
            <p className="mb-2"><span className="text-gray-600 font-medium w-32 inline-block">Total:</span> <span className="font-bold text-red-700">${parseFloat(placedOrder.total).toFixed(2)}</span></p>
            <p className="mb-2"><span className="text-gray-600 font-medium w-32 inline-block">Shipping to:</span> <span>{placedOrder.name}, {placedOrder.address}, {placedOrder.city}</span></p>
            <p><span className="text-gray-600 font-medium w-32 inline-block">Delivery by:</span> <span className="font-bold text-green-700">Thursday, Oct 12</span></p>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/orders" className="bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 py-2 px-6 rounded-md font-medium">Review or edit your recent orders</Link>
            <Link to="/" className="bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] py-2 px-6 rounded-md font-medium">Continue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      {/* Fake Amazon Checkout Header */}
      <header className="bg-white border-b border-gray-300 py-4 px-6 flex justify-between items-center max-w-[1200px] mx-auto">
        <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tighter">Spark<span className="text-[#ff9900]">Cart</span></Link>
        <h1 className="text-2xl font-medium text-gray-800">Checkout</h1>
        <ShieldCheck size={28} className="text-gray-400" />
      </header>

      <div className="max-w-[1200px] mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 items-start">
        {/* Accordion Flow (Left side) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          
          {/* STEP 1: Delivery Address */}
          <div className={`border border-gray-300 rounded-sm bg-white overflow-hidden ${step === 1 ? 'ring-1 ring-blue-500 shadow-md' : 'opacity-80'}`}>
            <div className={`flex justify-between items-center p-4 cursor-pointer ${step === 1 ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`} onClick={() => setStep(1)}>
              <h2 className={`text-lg font-bold ${step === 1 ? 'text-blue-600' : 'text-gray-900'}`}>1 &nbsp;&nbsp; Delivery address</h2>
              {step > 1 && <span className="text-sm text-blue-600 hover:underline">Change</span>}
            </div>
            
            {step === 1 && (
              <div className="p-6 border-t border-gray-200">
                <form onSubmit={handleShippingSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Full name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Address line 1</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" placeholder="Street address, P.O. box, company name, c/o" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-800 mb-1">City</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-bold text-gray-800 mb-1">ZIP Code</label>
                      <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  <button type="submit" className="mt-4 bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] py-2 px-6 rounded-md font-medium shadow-sm">Use this address</button>
                </form>
              </div>
            )}
            
            {step > 1 && (
              <div className="px-10 pb-4 text-sm text-gray-700">
                <p>{name}</p>
                <p>{address}</p>
                <p>{city}, {postalCode}</p>
              </div>
            )}
          </div>

          {/* STEP 2: Payment Method */}
          <div className={`border border-gray-300 rounded-sm bg-white overflow-hidden ${step === 2 ? 'ring-1 ring-blue-500 shadow-md' : 'opacity-80'}`}>
            <div className={`flex justify-between items-center p-4 ${step === 2 ? 'bg-blue-50/50' : step > 2 ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'}`} onClick={() => step > 2 && setStep(2)}>
              <h2 className={`text-lg font-bold ${step === 2 ? 'text-blue-600' : 'text-gray-900'}`}>2 &nbsp;&nbsp; Payment method</h2>
              {step > 2 && <span className="text-sm text-blue-600 hover:underline">Change</span>}
            </div>
            
            {step === 2 && (
              <div className="p-6 border-t border-gray-200">
                <form onSubmit={handlePaymentSubmit} className="space-y-4 max-w-md">
                  <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Your connection is securely encrypted.</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Card number</label>
                    <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())} maxLength="19" required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-800 mb-1">Expiration date</label>
                      <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} maxLength="5" required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" placeholder="MM/YY" />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-bold text-gray-800 mb-1">CVV</label>
                      <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} maxLength="3" required className="w-full border border-gray-400 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="submit" disabled={loading} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] py-2 px-6 rounded-md font-medium shadow-sm w-max disabled:opacity-50">
                      {loading ? 'Processing...' : 'Use this payment method'}
                    </button>
                    <button type="button" onClick={handleCryptoPayment} disabled={loading} className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 py-2 px-6 rounded-md font-medium shadow-sm w-max flex items-center gap-2 disabled:opacity-50">
                      <Zap size={16} className="text-blue-500" />
                      {loading ? 'Confirming...' : 'Pay with Crypto (Web3)'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step > 2 && (
              <div className="px-10 pb-4 text-sm text-gray-700 flex items-center gap-2">
                <CreditCard size={18} className="text-gray-500" />
                <span>Card ending in {cardNumber.slice(-4) || '****'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Amazon-style Order Summary (Right side) */}
        <div className="w-full lg:w-1/3">
          <div className="border border-gray-300 rounded-sm bg-white p-6 shadow-sm sticky top-24">
            <button 
              onClick={handlePaymentSubmit}
              disabled={step !== 2 || loading} 
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] py-3 rounded-md font-bold shadow-sm text-sm mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Place your order'}
            </button>
            <p className="text-xs text-center text-gray-500 mb-4 pb-4 border-b border-gray-200 leading-tight">By placing your order, you agree to SparkCart's privacy notice and conditions of use.</p>
            
            <h3 className="font-bold text-gray-900 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-700 space-y-2 mb-4 border-b border-gray-200 pb-4">
              <div className="flex justify-between">
                <span>Items ({cart.length}):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & handling:</span>
                <span>{shipping === 0 ? '$0.00' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Total before tax:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax to be collected:</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-red-700">Order total:</span>
              <span className="text-xl font-bold text-red-700">${total.toFixed(2)}</span>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                <span className="font-bold block mb-1">There was a problem</span>
                {error}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
