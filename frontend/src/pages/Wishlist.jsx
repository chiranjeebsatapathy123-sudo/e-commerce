import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Tag, ArrowRight } from 'lucide-react';

const Wishlist = ({ wishlist, toggleWishlist, addToCart }) => {
  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center transform transition-all duration-500 hover:scale-[1.02] hover:bg-white/10">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full group-hover:bg-pink-500/40 transition-colors duration-500"></div>
            <Heart size={80} strokeWidth={1.5} className="text-pink-500 relative z-10 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4 tracking-tight">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">Curate your personal collection of must-have items. They'll be waiting for you right here.</p>
          <Link to="/" className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Explore Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Your Wishlist</h1>
          <p className="text-gray-400 mt-2">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlist.map((product) => (
          <div key={product.id} className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col">
            <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden bg-gray-900">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Fake price drop logic for styling demonstration */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="flex items-center gap-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/20">
                  <Tag size={12} /> Price Dropped
                </span>
              </div>
            </Link>
            
            <div className="p-6 flex flex-col flex-1 relative z-10">
              <span className="text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-2">{product.category}</span>
              <Link to={`/product/${product.id}`} className="block mb-2">
                <h3 className="text-lg font-bold text-gray-100 leading-tight group-hover:text-white transition-colors line-clamp-2">{product.name}</h3>
              </Link>
              
              <div className="flex items-end gap-3 mb-6 mt-auto pt-4">
                <div className="text-2xl font-bold text-white">${parseFloat(product.price).toFixed(2)}</div>
                <div className="text-gray-500 text-sm line-through pb-1">${(parseFloat(product.price) * 1.2).toFixed(2)}</div>
              </div>
              
              <div className="flex items-center gap-3 mt-auto">
                {product.stock > 0 ? (
                  <button 
                    onClick={() => addToCart(product)} 
                    className="flex-1 bg-white/10 hover:bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 border border-white/10 hover:border-indigo-500 flex items-center justify-center gap-2 group/btn"
                  >
                    <ShoppingCart size={18} className="group-hover/btn:-rotate-12 transition-transform" /> Move to Cart
                  </button>
                ) : (
                  <span className="flex-1 bg-red-500/20 text-red-400 font-medium py-2.5 px-4 rounded-xl border border-red-500/20 text-center">
                    Out of Stock
                  </span>
                )}
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl border border-white/10 hover:border-red-500/30 transition-all duration-300 group/trash"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
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
