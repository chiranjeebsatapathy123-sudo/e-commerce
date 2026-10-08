import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Zap } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const QuickOrderPortal = ({ addToCart }) => {
  const [rows, setRows] = useState([{ sku: '', quantity: 1, product: null, loading: false, error: '' }]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addRow = () => {
    setRows([...rows, { sku: '', quantity: 1, product: null, loading: false, error: '' }]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const updateRow = async (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    if (field === 'sku' && value.length >= 3) {
      newRows[index].loading = true;
      newRows[index].error = '';
      try {
        // Debounce or search product by SKU
        const res = await api.get(`/products/sku/${value}`);
        if (res.data.success) {
          newRows[index].product = res.data.product;
        } else {
          newRows[index].product = null;
        }
      } catch (err) {
        newRows[index].product = null;
        if (value.length > 5) {
          newRows[index].error = 'SKU not found';
        }
      } finally {
        newRows[index].loading = false;
      }
    }

    setRows(newRows);
  };

  const handleAddAllToCart = () => {
    setIsProcessing(true);
    let addedCount = 0;
    rows.forEach(row => {
      if (row.product && row.quantity > 0) {
        for (let i = 0; i < row.quantity; i++) {
           // Basic add to cart for each quantity or assume addToCart accepts quantity
           // Since addToCart typically increments by 1, we can just call it row.quantity times, 
           // or ideally adapt addToCart to accept quantity. We'll simulate by calling multiple times or adjusting state.
           addToCart(row.product);
        }
        addedCount++;
      }
    });

    setTimeout(() => {
      setIsProcessing(false);
      setRows([{ sku: '', quantity: 1, product: null, loading: false, error: '' }]);
      alert(`Added ${addedCount} products to cart.`);
    }, 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">B2B Quick Order Portal</h2>
          <p className="text-gray-400 text-sm">Enter SKUs to quickly add bulk items to your order.</p>
        </div>
      </div>

      <div className="overflow-x-auto mb-6 relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-sm">
              <th className="pb-3 font-medium w-1/3">SKU</th>
              <th className="pb-3 font-medium w-1/3">Product</th>
              <th className="pb-3 font-medium w-1/6">Quantity</th>
              <th className="pb-3 font-medium w-1/6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {rows.map((row, index) => (
                <motion.tr 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  key={index} 
                  className="group transition-colors hover:bg-white/5"
                >
                  <td className="py-3 pr-4">
                    <input 
                      type="text" 
                      value={row.sku}
                      onChange={(e) => updateRow(index, 'sku', e.target.value)}
                      placeholder="Enter SKU..." 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase placeholder-gray-600"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {row.loading ? (
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </span>
                    ) : row.error ? (
                      <span className="text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-full">{row.error}</span>
                    ) : row.product ? (
                      <div className="flex items-center gap-3">
                        <img src={row.product.image} alt={row.product.name} className="w-10 h-10 object-cover rounded-lg bg-white/10 shadow-lg" />
                        <div>
                          <div className="text-sm font-medium text-white line-clamp-1">{row.product.name}</div>
                          <div className="text-xs text-blue-400 font-bold">${parseFloat(row.product.price).toFixed(2)}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-sm italic">Waiting for SKU...</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <input 
                      type="number" 
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(index, 'quantity', parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <motion.button 
                      whileHover={{ scale: rows.length === 1 ? 1 : 1.1 }}
                      whileTap={{ scale: rows.length === 1 ? 1 : 0.9 }}
                      onClick={() => removeRow(index)}
                      disabled={rows.length === 1}
                      className={`p-3 rounded-xl transition-all ${rows.length === 1 ? 'text-gray-600 cursor-not-allowed bg-black/20' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/20 bg-white/5'}`}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center relative z-10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addRow}
          className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20"
        >
          <Plus size={16} /> Add Row
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: isProcessing || !rows.some(r => r.product) ? 1 : 1.05 }}
          whileTap={{ scale: isProcessing || !rows.some(r => r.product) ? 1 : 0.95 }}
          onClick={handleAddAllToCart}
          disabled={isProcessing || !rows.some(r => r.product)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:border disabled:border-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
        >
          <ShoppingCart size={18} />
          {isProcessing ? 'Processing...' : 'Add All to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuickOrderPortal;
