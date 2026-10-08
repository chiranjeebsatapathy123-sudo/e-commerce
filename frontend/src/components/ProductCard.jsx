import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Plus } from 'lucide-react';
import HolographicCard from './HolographicCard';

const ProductCard = ({ product, addToCart, wishlist = [], toggleWishlist, isMinimal = false }) => {
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

  if (isMinimal) {
    return (
      <HolographicCard>
        <Link to={`/product/${product.id}`} className="block relative group">
          <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-[#0a0a0a] rounded-3xl overflow-hidden relative mb-4">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] mix-blend-multiply dark:mix-blend-lighten" />
            
            <button 
              onClick={handleWishlistClick}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isWishlisted ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-500 border border-rose-200 dark:border-rose-500/50' : 'bg-white/80 dark:bg-black/40 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white border border-transparent hover:text-black shadow-sm'}`}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            
            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
              <button onClick={handleCartClick} className="w-full bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-bold py-3 rounded-2xl hover:bg-white dark:hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 shadow-xl">
                <Plus size={18} /> Quick Add
              </button>
            </div>
          </div>
          <div className="px-1">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{product.category}</p>
                <h3 className="font-medium text-gray-900 dark:text-white truncate w-40">{product.name}</h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-gray-900 dark:text-white">${parseFloat(product.price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Link>
      </HolographicCard>
    );
  }

  // Standard Card
  return (
    <HolographicCard>
      <Link to={`/product/${product.id}`} className="block bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-xl dark:hover:shadow-2xl">
        <div className="w-full aspect-square bg-gray-50 dark:bg-[#050505] relative overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-90 dark:opacity-70 group-hover:scale-105 transition-transform duration-500" />
          <button 
            onClick={handleWishlistClick} 
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${isWishlisted ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-500' : 'bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white hover:bg-white hover:text-black shadow-sm'}`}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-5">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 block">{product.category}</span>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-700'} 
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="font-black text-xl text-gray-900 dark:text-white">${parseFloat(product.price).toFixed(2)}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">${(parseFloat(product.price) * 1.2).toFixed(2)}</span>
            </div>
            
            {product.stock > 0 ? (
              <button 
                onClick={handleCartClick} 
                className="bg-indigo-50 dark:bg-white/10 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-600 dark:text-white hover:text-white p-3 rounded-2xl transition-colors backdrop-blur-sm"
              >
                <ShoppingCart size={18} />
              </button>
            ) : (
              <span className="bg-red-50 dark:bg-red-500/20 text-red-500 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">Sold Out</span>
            )}
          </div>
        </div>
      </Link>
    </HolographicCard>
  );
};

export default ProductCard;
