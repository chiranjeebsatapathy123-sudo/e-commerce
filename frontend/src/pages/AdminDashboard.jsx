import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  BarChart3, PackagePlus, ShoppingBag, Users, Edit3, Trash2, Plus, X, 
  CircleDollarSign, Sparkles, AlertTriangle, Database, Search, MessageSquare, CheckCircle, ShieldAlert
} from 'lucide-react';
import BusinessCopilot from '../components/BusinessCopilot';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ userInfo }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [inventoryHealth, setInventoryHealth] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [searchIntelligenceData, setSearchIntelligenceData] = useState(null);
  const [reviewIntelligenceData, setReviewIntelligenceData] = useState(null);
  const [aiControlData, setAiControlData] = useState(null);
  const [pendingActions, setPendingActions] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!userInfo || !['admin', 'Super Admin', 'Finance Manager', 'Inventory Manager', 'Order Manager'].includes(userInfo.role)) {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [userInfo, navigate, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'analytics') {
        const [
          analyticsRes, 
          revenueRes, 
          inventoryRes, 
          anomaliesRes, 
          alertsRes
        ] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/analytics/revenue'),
          api.get('/admin/inventory/health'),
          api.get('/admin/anomalies'),
          api.get('/admin/alerts')
        ]);
        setAnalyticsData(analyticsRes.data);
        setRevenueData(revenueRes.data);
        setInventoryHealth(inventoryRes.data);
        setAnomalies(anomaliesRes.data);
        setAlerts(alertsRes.data);
      } else if (activeTab === 'products') {
        const { data } = await api.get('/products', { params: { limit: 100 } });
        setProducts(data.products);
      } else if (activeTab === 'orders') {
        const { data } = await api.get('/admin/orders');
        setOrders(data);
      } else if (activeTab === 'users') {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } else if (activeTab === 'search') {
        const { data } = await api.get('/admin/search-intelligence');
        setSearchIntelligenceData(data);
      } else if (activeTab === 'reviews') {
        const { data } = await api.get('/admin/reviews/intelligence');
        setReviewIntelligenceData(data);
      } else if (activeTab === 'ai-control') {
        const { data } = await api.get('/admin/ai/status');
        setAiControlData(data);
      } else if (activeTab === 'ai-approval') {
        const { data } = await api.get('/commerce-brain/actions/pending');
        setPendingActions(data);
      } else if (activeTab === 'opportunities') {
        const { data } = await api.get('/admin/opportunities');
        setOpportunities(data);
      } else if (activeTab === 'incidents') {
        const { data } = await api.get('/admin/ai/incidents');
        setIncidents(data.incidents || []);
      } else if (activeTab === 'experiments') {
        const { data } = await api.get('/admin/ai/experiments');
        setExperiments(data.experiments || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve admin details');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice('');
    setProdCategory('Electronics');
    setProdStock('');
    setProdDesc('');
    setProdImage('');
    setProdImages('');
    setModalError('');
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdPrice(product.price);
    setProdCategory(product.category);
    setProdStock(product.stock);
    setProdDesc(product.description || '');
    setProdImage(product.image || '');
    setProdImages(product.images || '');
    setModalError('');
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    const payload = {
      name: prodName,
      price: parseFloat(prodPrice),
      category: prodCategory,
      stock: parseInt(prodStock),
      description: prodDesc,
      image: prodImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      images: prodImages || prodImage
    };

    try {
      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setShowProductModal(false);
      fetchAdminData();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleUpdateUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await api.put(`/admin/users/${userId}`, { role: newRole });
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0 left-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Control Panel</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'analytics' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <BarChart3 size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <PackagePlus size={18} /> Catalog
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ShoppingBag size={18} /> Orders
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users size={18} /> Users
          </button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">AI Systems</div>
          <button onClick={() => setActiveTab('search')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'search' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
            <Sparkles size={18} /> Search Engine
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'reviews' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
            <MessageSquare size={18} /> AI Moderation
          </button>
          <button onClick={() => setActiveTab('ai-control')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'ai-control' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
            <Database size={18} /> AI Settings
          </button>
          <button onClick={() => setActiveTab('ai-approval')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'ai-approval' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
            <ShieldAlert size={18} /> Approvals
          </button>
          <button onClick={() => setActiveTab('copilot')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'copilot' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
            <Sparkles size={18} /> Business Copilot
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Reports</div>
          <button onClick={() => setActiveTab('opportunities')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'opportunities' ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <CircleDollarSign size={18} /> Opportunities
          </button>
          <button onClick={() => setActiveTab('incidents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'incidents' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-red-50 hover:text-red-700'}`}>
            <AlertTriangle size={18} /> Incidents
          </button>
          <button onClick={() => setActiveTab('experiments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'experiments' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
            <Edit3 size={18} /> Experiments
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
            {activeTab === 'products' && (
              <button onClick={openAddModal} className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={18} /> Add Product
              </button>
            )}
          </div>

      {error && <div className="error-state glass-panel"><p>{error}</p></div>}

      {loading ? (
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
          <p>Retrieving control panel records...</p>
        </div>
      ) : (
        <div className="admin-tab-content">
          {activeTab === 'analytics' && analyticsData && (
            <div className="analytics-view">
              <div className="metrics-grid">
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper sales-bg">
                    <CircleDollarSign size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Total Sales</span>
                    <h3>${analyticsData.summary.totalSales.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper orders-bg">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Total Orders</span>
                    <h3>{analyticsData.summary.totalOrders}</h3>
                  </div>
                </div>

                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper products-bg">
                    <PackagePlus size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Total Products</span>
                    <h3>{analyticsData.summary.totalProducts}</h3>
                  </div>
                </div>

                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper users-bg">
                    <Users size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Total Customers</span>
                    <h3>{analyticsData.summary.totalUsers}</h3>
                  </div>
                </div>
              </div>

              <div className="ai-business-insights glass-panel" style={{ marginTop: '24px', marginBottom: '24px', padding: '24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(var(--primary-hsl), 0.05) 0%, rgba(var(--accent), 0.05) 100%)', border: '1px solid rgba(var(--primary-hsl), 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--primary)' }}>
                  <Sparkles size={24} />
                  <h3 style={{ margin: 0 }}>Business Intelligence Insights</h3>
                </div>
                <ul style={{ paddingLeft: '24px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {anomalies.map((ano, i) => (
                    <li key={`ano-${i}`}><strong>Anomaly Detected:</strong> {ano.message}</li>
                  ))}
                  {inventoryHealth && inventoryHealth.metrics.lowStock > 0 && (
                    <li><strong>Inventory Alert:</strong> {inventoryHealth.metrics.lowStock} products are running low on stock.</li>
                  )}
                  {inventoryHealth && inventoryHealth.metrics.outOfStock > 0 && (
                    <li><strong>Stockout:</strong> {inventoryHealth.metrics.outOfStock} products are currently out of stock.</li>
                  )}
                  {anomalies.length === 0 && (!inventoryHealth || (inventoryHealth.metrics.lowStock === 0 && inventoryHealth.metrics.outOfStock === 0)) && (
                    <li>No urgent business alerts. Operations are nominal.</li>
                  )}
                </ul>
              </div>

              <div className="analytics-details-grid">
                <div className="category-sales-card glass-panel">
                  <h3>Revenue Share by Category</h3>
                  {analyticsData.categoryData.length === 0 ? (
                    <p className="no-data-hint">No categories have completed orders yet.</p>
                  ) : (
                    <div className="category-charts-list">
                      {analyticsData.categoryData.map((cat, i) => {
                        const maxVal = Math.max(...analyticsData.categoryData.map(c => c.value), 1);
                        const percent = (cat.value / maxVal) * 100;
                        return (
                          <div key={i} className="category-chart-row">
                            <div className="category-chart-info">
                              <span>{cat.name}</span>
                              <strong>${cat.value.toFixed(2)}</strong>
                            </div>
                            <div className="progress-bar-bg">
                              <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="recent-orders-card glass-panel">
                  <h3>Recent Store Orders</h3>
                  {analyticsData.recentOrders.length === 0 ? (
                    <p className="no-data-hint">No orders processed yet.</p>
                  ) : (
                    <div className="recent-orders-list">
                      {analyticsData.recentOrders.map((ord) => (
                        <div key={ord.id} className="recent-order-item">
                          <div className="recent-order-info">
                            <strong>Order #{ord.id}</strong>
                            <span>{ord.User?.email || 'Guest User'}</span>
                          </div>
                          <div className="recent-order-status">
                            <span className={`badge ${ord.status === 'Delivered' ? 'badge-success' : 'badge-coral'}`}>
                              {ord.status}
                            </span>
                            <strong>${parseFloat(ord.total).toFixed(2)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && searchIntelligenceData && (
            <div className="search-intelligence-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="text-h3">Search Engine Health & Analytics</h3>
                <button 
                  onClick={async () => {
                    if (window.confirm("This will regenerate all AI embeddings. It may take some time depending on your AI Provider's rate limits. Continue?")) {
                      await api.post('/admin/search/reindex');
                      alert("Reindexing started.");
                    }
                  }} 
                  className="btn btn-secondary btn-sm"
                >
                  <Sparkles size={16} style={{ marginRight: '6px' }} /> Reindex Embeddings
                </button>
              </div>
              <div className="metrics-grid">
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper sales-bg">
                    <Sparkles size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Total Searches</span>
                    <h3>{searchIntelligenceData.metrics.totalSearches}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper users-bg">
                    <Search size={24} />
                  </div>
                  <div className="metric-data">
                    <span>AI-Assisted Searches</span>
                    <h3>{searchIntelligenceData.metrics.aiAssistedCount}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper orders-bg">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Zero-Result Rate</span>
                    <h3>{(searchIntelligenceData.metrics.zeroResultRate * 100).toFixed(0)}%</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper products-bg">
                    <Database size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Embedding Coverage</span>
                    <h3>{(searchIntelligenceData.metrics.embeddingCoverage * 100).toFixed(0)}%</h3>
                  </div>
                </div>
              </div>
              
              <div className="analytics-details-grid" style={{ marginTop: '24px' }}>
                <div className="recent-orders-card glass-panel">
                  <h3>Top Search Queries</h3>
                  {searchIntelligenceData.topQueries.length === 0 ? (
                    <p className="no-data-hint">No searches yet.</p>
                  ) : (
                    <div className="recent-orders-list">
                      {searchIntelligenceData.topQueries.map((q, idx) => (
                        <div key={idx} className="recent-order-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>"{q.query}"</strong>
                          <span className="badge badge-primary">{q.occurrences} searches</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="recent-orders-card glass-panel" style={{ borderLeft: '4px solid var(--coral)' }}>
                  <h3 style={{ color: 'var(--coral)' }}>Zero-Result Queries</h3>
                  <p className="text-small text-muted" style={{ marginBottom: '16px' }}>Queries that returned no products.</p>
                  {searchIntelligenceData.zeroResultQueries.length === 0 ? (
                    <p className="no-data-hint">No zero-result searches!</p>
                  ) : (
                    <div className="recent-orders-list">
                      {searchIntelligenceData.zeroResultQueries.map((q, idx) => (
                        <div key={idx} className="recent-order-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>"{q.query}"</strong>
                          <span className="badge badge-coral">{q.occurrences} searches</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && reviewIntelligenceData && (
            <div className="review-intelligence-view">
              <h3 className="text-h3" style={{ marginBottom: '24px' }}>AI Review Intelligence & Moderation</h3>
              <div className="metrics-grid">
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper sales-bg">
                    <MessageSquare size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Total Reviews</span>
                    <h3>{reviewIntelligenceData.metrics.totalReviews}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper products-bg">
                    <CheckCircle size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Positive Themes Found</span>
                    <h3>{reviewIntelligenceData.metrics.totalPositiveThemes}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper orders-bg">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Negative Themes Found</span>
                    <h3>{reviewIntelligenceData.metrics.totalNegativeThemes}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-icon-wrapper" style={{ background: 'rgba(var(--danger-hsl), 0.1)', color: 'var(--danger)' }}>
                    <ShieldAlert size={24} />
                  </div>
                  <div className="metric-data">
                    <span>Action Required</span>
                    <h3>{reviewIntelligenceData.metrics.pendingReviews + reviewIntelligenceData.metrics.flaggedReviews}</h3>
                  </div>
                </div>
              </div>

              <div className="recent-orders-card glass-panel" style={{ marginTop: '24px' }}>
                <h3 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Reviews Needing Moderation</h3>
                {reviewIntelligenceData.flaggedList.length === 0 ? (
                  <p className="no-data-hint">All reviews look good! No moderation needed.</p>
                ) : (
                  <div className="recent-orders-list">
                    {reviewIntelligenceData.flaggedList.map((rev) => (
                      <div key={rev.id} className="recent-order-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <strong>{rev.Product?.name} - {rev.rating}/5 Stars</strong>
                          <span className={`badge ${rev.status === 'Flagged' ? 'badge-coral' : 'badge-primary'}`}>{rev.status}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', margin: 0, padding: '8px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', width: '100%' }}>"{rev.comment}"</p>
                        {rev.flaggedReason && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--danger)' }}><strong>Flag Reason:</strong> {rev.flaggedReason}</div>
                        )}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button 
                            onClick={async () => {
                              await api.put(`/admin/reviews/${rev.id}/status`, { status: 'Approved' });
                              fetchAdminData();
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={async () => {
                              await api.put(`/admin/reviews/${rev.id}/status`, { status: 'Rejected' });
                              fetchAdminData();
                            }}
                            className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}
                          >
                            Reject (Hide)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai-control' && aiControlData && (
            <div className="ai-control-view">
              <h3 className="text-h3" style={{ marginBottom: '24px' }}>AI Systems Control</h3>
              
              <div className="metrics-grid" style={{ marginBottom: '32px' }}>
                <div className="metric-card glass-panel">
                  <div className="metric-data">
                    <span className="text-muted">System Health</span>
                    <h3 style={{ color: 'var(--success)' }}>{aiControlData.systemHealth}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-data">
                    <span className="text-muted">Search Engine</span>
                    <h3>{aiControlData.metrics.searchAiStatus}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-data">
                    <span className="text-muted">Average Latency</span>
                    <h3>{aiControlData.metrics.averageLatency}</h3>
                  </div>
                </div>
                <div className="metric-card glass-panel">
                  <div className="metric-data">
                    <span className="text-muted">Stale Reviews Queue</span>
                    <h3>{aiControlData.metrics.reviewAnalysisQueue}</h3>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: '16px' }}>Background Operations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <strong>Regenerate Product Embeddings</strong>
                      <p className="text-small text-muted" style={{ margin: 0 }}>Re-calculate vector embeddings for all products.</p>
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={async () => {
                        const { data } = await api.post('/admin/ai/jobs', { jobName: 'regenerate_embeddings' });
                        alert(data.message);
                      }}
                    >Execute Job</button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <strong>Re-analyze All Reviews</strong>
                      <p className="text-small text-muted" style={{ margin: 0 }}>Force the AI to re-read and summarize all approved reviews.</p>
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={async () => {
                        const { data } = await api.post('/admin/ai/jobs', { jobName: 'reanalyze_reviews' });
                        alert(data.message);
                        fetchAdminData();
                      }}
                    >Execute Job</button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <strong>Clear AI Context Cache</strong>
                      <p className="text-small text-muted" style={{ margin: 0 }}>Purge the Redis/In-memory cache for shopping sessions.</p>
                    </div>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        const { data } = await api.post('/admin/ai/jobs', { jobName: 'clear_ai_cache' });
                        alert(data.message);
                      }}
                    >Clear Cache</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'copilot' && (
            <div className="copilot-view">
              <BusinessCopilot />
            </div>
          )}

          {activeTab === 'ai-approval' && (
            <div className="ai-approval-view">
              <h3 className="text-h3" style={{ marginBottom: '24px' }}>Pending AI Actions</h3>
              <p className="text-muted" style={{ marginBottom: '24px' }}>Review and approve actions proposed by the autonomous Commerce Brain.</p>
              {pendingActions.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                  <ShieldAlert size={48} className="text-muted" style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <h3>No Pending Actions</h3>
                  <p className="text-muted">The system has no autonomous actions waiting for approval.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingActions.map(action => (
                    <div key={action.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px' }}>{action.actionType}</h4>
                          <span className="text-small text-muted">Proposed by: {action.proposedBy} • Confidence: {(action.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <span className="badge badge-warning">Pending</span>
                      </div>
                      <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                        <strong>Reason:</strong> {action.reason}
                        <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Payload: {action.payload}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={async () => {
                            try {
                              await api.post(`/commerce-brain/actions/${action.id}/review`, { status: 'approved' });
                              fetchAdminData();
                            } catch (e) { console.error(e); }
                          }}
                        >
                          Approve Action
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={async () => {
                            try {
                              await api.post(`/commerce-brain/actions/${action.id}/review`, { status: 'rejected' });
                              fetchAdminData();
                            } catch (e) { console.error(e); }
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td className="table-product-cell">
                        <img src={prod.image} alt={prod.name} />
                        <span>{prod.name}</span>
                      </td>
                      <td>{prod.category}</td>
                      <td>${parseFloat(prod.price).toFixed(2)}</td>
                      <td>
                        <span className={prod.stock === 0 ? 'text-danger' : prod.stock < 5 ? 'text-warning' : ''}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td>⭐ {prod.rating} ({prod.reviewsCount})</td>
                      <td className="table-actions">
                        <button onClick={() => openEditModal(prod)} className="table-action-btn edit-btn" title="Edit Product">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(prod.id)} className="table-action-btn delete-btn" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Set Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td><strong>#{ord.id}</strong></td>
                      <td>
                        <div className="table-user-cell">
                          <strong>{ord.name}</strong>
                          <span>{ord.User?.email}</span>
                        </div>
                      </td>
                      <td>{ord.address}, {ord.city}</td>
                      <td>${parseFloat(ord.total).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${ord.status === 'Delivered' ? 'badge-success' : 'badge-coral'}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="table-select-status"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="table-wrapper glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Role Privilege</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((usr) => (
                    <tr key={usr.id}>
                      <td>#{usr.id}</td>
                      <td><strong>{usr.name}</strong></td>
                      <td>{usr.email}</td>
                      <td>
                        <span className={`badge ${usr.role === 'admin' ? 'badge-success' : 'badge-secondary'}`}>
                          {usr.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button 
                          disabled={usr.id === userInfo.id}
                          onClick={() => handleUpdateUserRole(usr.id, usr.role)}
                          className="btn btn-secondary btn-sm"
                        >
                          Toggle Access Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="opportunities-view glass-panel">
              <h3 className="text-h3" style={{ marginBottom: '24px' }}>AI Business Opportunities</h3>
              {opportunities.length === 0 ? (
                <p className="no-data-hint">No actionable opportunities detected at this time.</p>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="opportunity-card glass-panel" style={{ borderLeft: '4px solid var(--accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>{opp.type}</strong>
                        <span className="badge badge-primary">Confidence: {(opp.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p><strong>Evidence:</strong> {opp.evidence}</p>
                      <p><strong>Impact Estimate:</strong> {opp.impactEstimate}</p>
                      <p><strong>Recommendation:</strong> {opp.recommendedAction}</p>
                      <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Review Action</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="incidents-view glass-panel">
              <h3 className="text-h3" style={{ marginBottom: '24px' }}>AI Incident Center</h3>
              {incidents.length === 0 ? (
                <p className="no-data-hint">No AI incidents or failures logged.</p>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {incidents.map((inc) => (
                    <div key={inc.id} className="incident-card glass-panel" style={{ borderLeft: '4px solid var(--danger)' }}>
                      <strong>{inc.type}</strong>
                      <p>{inc.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'experiments' && (
            <div className="experiments-view glass-panel">
              <h3 className="text-h3" style={{ marginBottom: '24px' }}>Experimentation Studio</h3>
              {experiments.length === 0 ? (
                <p className="no-data-hint">No active A/B tests or experiments running.</p>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {experiments.map((exp) => (
                    <div key={exp.id} className="experiment-card glass-panel">
                      <strong>{exp.name}</strong>
                      <p>Status: {exp.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {showProductModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel animate-scale-in">
            <div className="modal-header">
              <h2>{editingProductId ? 'Edit Store Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowProductModal(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>

            {modalError && <div className="form-error">{modalError}</div>}

            <form onSubmit={handleProductSubmit} className="modal-form" style={{ display: 'grid', gap: '16px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
              
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginTop: '16px' }}>Basic Info</h3>
              <div className="input-group">
                <label htmlFor="modal-name">Product Name</label>
                <input id="modal-name" type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g. Bluetooth Speakers" className="input-field" required />
              </div>
              <div className="input-group">
                <label htmlFor="modal-cat">Category</label>
                <select id="modal-cat" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="input-field">
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="modal-desc">Description</label>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}>
                    <Sparkles size={12} className="text-primary"/> Generate with AI
                  </button>
                </div>
                <textarea id="modal-desc" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="Enter detailed description..." className="input-field" rows="3"></textarea>
              </div>

              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginTop: '16px' }}>Pricing & Inventory</h3>
              <div className="checkout-row-inputs">
                <div className="input-group flex-1">
                  <label htmlFor="modal-price">Price ($)</label>
                  <input id="modal-price" type="number" step="0.01" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="99.99" className="input-field" required />
                </div>
                <div className="input-group flex-1">
                  <label htmlFor="modal-stock">Inventory Stock</label>
                  <input id="modal-stock" type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} placeholder="25" className="input-field" required />
                </div>
              </div>

              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginTop: '16px' }}>Images</h3>
              <div className="input-group">
                <label htmlFor="modal-image">Main Image URL</label>
                <input id="modal-image" type="text" value={prodImage} onChange={(e) => setProdImage(e.target.value)} placeholder="https://unsplash.com/..." className="input-field" />
              </div>
              <div className="input-group">
                <label htmlFor="modal-images">Additional Image URLs (comma-separated)</label>
                <input id="modal-images" type="text" value={prodImages} onChange={(e) => setProdImages(e.target.value)} placeholder="URL1,URL2,URL3" className="input-field" />
              </div>

              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginTop: '16px' }}>Advanced Settings</h3>
              <div className="input-group">
                <label>SEO Title & Meta Description</label>
                <input type="text" placeholder="SEO Title" className="input-field" style={{ marginBottom: '8px' }} />
                <textarea placeholder="SEO Meta Description" className="input-field" rows="2"></textarea>
              </div>
              <div className="input-group">
                <label>Shipping Weight (kg)</label>
                <input type="number" placeholder="1.5" className="input-field" />
              </div>

              <div className="modal-actions" style={{ position: 'sticky', bottom: 0, background: 'var(--panel)', padding: '16px 0', borderTop: '1px solid var(--border)', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={() => { alert('Draft saved successfully!'); setShowProductModal(false); }} className="btn btn-secondary" style={{ marginLeft: '12px' }}>
                  Save Draft
                </button>
                <button type="submit" disabled={modalLoading} className="btn btn-primary" style={{ marginLeft: '12px' }}>
                  {modalLoading ? 'Saving...' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
