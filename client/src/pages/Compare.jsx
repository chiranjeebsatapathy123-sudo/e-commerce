import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Compare = ({ addToCart, wishlist, toggleWishlist }) => {
  const navigate = useNavigate();
  const [compareIds, setCompareIds] = useState(() => JSON.parse(localStorage.getItem('compareIds') || '[]'));
  const [products, setProducts] = useState([]);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('compareIds', JSON.stringify(compareIds));
    if (compareIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const promises = compareIds.map(id => api.get(`/products/${id}`));
        const responses = await Promise.all(promises);
        setProducts(responses.map(r => r.data));
      } catch (err) {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [compareIds]);

  const removeProduct = (id) => {
    setCompareIds(prev => prev.filter(pid => pid !== id));
    setAiExplanation(null);
  };

  const getAiComparison = async () => {
    if (products.length < 2) return;
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const res = await api.post('/ai/compare', { productIds: products.map(p => p.id) });
      setAiExplanation(res.data.explanation);
    } catch (e) {
      console.error(e);
      setAiExplanation("AI comparison is temporarily unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading products for comparison...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '16px' }}>Compare Products</h1>
        <div className="glass-panel" style={{ padding: '48px', borderRadius: 'var(--radius-lg)' }}>
          <p className="text-muted" style={{ marginBottom: '24px' }}>You haven't selected any products to compare.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '32px 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-h1">Product Comparison</h1>
        {products.length > 1 && (
          <button onClick={getAiComparison} className="btn btn-primary" disabled={aiLoading}>
            <Sparkles size={18} /> {aiLoading ? 'Analyzing...' : '✨ Compare with AI'}
          </button>
        )}
      </div>

      {aiExplanation && (
        <div className="glass-panel" style={{ marginBottom: '32px', padding: '24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(var(--primary-hsl), 0.05) 0%, rgba(var(--accent), 0.05) 100%)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)', fontWeight: '600' }}>
            <Sparkles size={20} />
            <span>Smart Comparison Insights</span>
          </div>
          <p style={{ lineHeight: '1.6' }}>{aiExplanation}</p>
        </div>
      )}

      <div style={{ overflowX: 'auto', paddingBottom: '24px' }}>
        <table className="comparison-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '150px', padding: '16px', textAlign: 'left', background: 'var(--panel)', borderBottom: '2px solid var(--border)' }}>Features</th>
              {products.map(p => (
                <th key={p.id} style={{ padding: '16px', textAlign: 'center', background: 'var(--panel)', borderBottom: '2px solid var(--border)', position: 'relative' }}>
                  <button onClick={() => removeProduct(p.id)} className="btn btn-secondary btn-sm btn-icon-only" style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}>
                    <Trash2 size={14} />
                  </button>
                  <img src={p.image} alt={p.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1rem', margin: '0 0 8px 0' }}>{p.name}</h3>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>${parseFloat(p.price).toFixed(2)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>Rating</td>
              {products.map(p => (
                <td key={p.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                  {p.rating > 0 ? (
                    <span>⭐ {p.rating} ({p.reviewsCount} reviews)</span>
                  ) : (
                    <span className="text-muted">No reviews yet</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>Brand</td>
              {products.map(p => (
                <td key={p.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>Spark</td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>Category</td>
              {products.map(p => (
                <td key={p.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>{p.category}</td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>Availability</td>
              {products.map(p => (
                <td key={p.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                  {p.stock > 0 ? <span style={{ color: 'var(--success)' }}>In Stock</span> : <span style={{ color: 'var(--danger)' }}>Out of Stock</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>Description</td>
              {products.map(p => (
                <td key={p.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {p.description || 'Not specified'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>Action</td>
              {products.map(p => (
                <td key={p.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                  <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm" disabled={p.stock === 0}>Add to Cart</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
