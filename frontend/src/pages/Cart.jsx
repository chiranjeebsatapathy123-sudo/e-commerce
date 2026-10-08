import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import QuickOrderPortal from '../components/QuickOrderPortal';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = ({ cart, removeFromCart, updateCartQty, addToCart }) => {
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="cart-page container min-h-[60vh] flex items-center justify-center"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <ShoppingBag size={80} className="text-indigo-400/50 mx-auto mb-8 animate-bounce-slow" />
          <h2 className="text-4xl font-bold text-white mb-4">Your cart is waiting.</h2>
          <p className="text-gray-400 text-lg mb-8">Explore our premium catalog to add item collections to your bag.</p>
          <Link to="/" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]">
            Explore Products
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cart-page container py-12"
    >
      <div className="mb-12">
        <QuickOrderPortal addToCart={addToCart} />
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                key={item.id} 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-lg group hover:bg-white/10 transition-colors"
              >
                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl shadow-md" />
                
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.id}`} className="hover:text-indigo-400 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                  </Link>
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300 mb-2">{item.category}</span>
                  <div className="text-indigo-400 font-bold">${parseFloat(item.price).toFixed(2)} <span className="text-gray-500 text-sm font-normal">each</span></div>
                </div>

                <div className="flex items-center gap-4 bg-black/40 rounded-xl p-2 border border-white/5">
                  <button 
                    onClick={() => updateCartQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-white font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQty(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right flex flex-col items-end gap-3 w-full sm:w-auto">
                  <span className="text-2xl font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    <span className="sm:hidden text-sm">Remove</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-indigo-300">Add <strong className="text-indigo-400 font-bold">${(150 - subtotal).toFixed(2)}</strong> more for Free Shipping!</p>
              </div>
            )}

            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-lg">Total</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout} 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 text-lg"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* AI Cart Assistant - Phase 6 */}
      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 backdrop-blur-xl rounded-3xl p-8 mt-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <Sparkles size={28} className="text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Spark AI Recommendations</h3>
        </div>
        <p className="text-blue-200/70 text-lg mb-6 relative z-10 max-w-2xl">Based on your cart, you might also like these accessories that pair perfectly with your current selection:</p>
        <div className="flex flex-wrap gap-4 relative z-10">
          <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-semibold py-3 px-6 rounded-xl transition-colors backdrop-blur-md" onClick={() => navigate('/')}>Complete your setup</button>
          <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-semibold py-3 px-6 rounded-xl transition-colors backdrop-blur-md" onClick={() => navigate('/ai')}>Ask AI for alternatives</button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
