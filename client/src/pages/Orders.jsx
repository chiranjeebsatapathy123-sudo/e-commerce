import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Package, ShoppingBag, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const Orders = ({ userInfo }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchMyOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetails(null);
      return;
    }

    setExpandedOrderId(orderId);
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrderDetails(data);
    } catch (err) {
      console.error('Failed to load order items details', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStatusStepClass = (currentStatus, targetStatus) => {
    const statuses = [
      'Order Placed', 'Payment Confirmed', 'Packed', 
      'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'
    ];
    const currentIndex = statuses.indexOf(currentStatus);
    const targetIndex = statuses.indexOf(targetStatus);

    if (currentIndex >= targetIndex) {
      return 'step-completed';
    }
    return 'step-pending';
  };

  const renderTracker = (currentStatus) => {
    const steps = [
      { id: 1, name: 'Order Placed' },
      { id: 2, name: 'Payment Confirmed' },
      { id: 3, name: 'Packed' },
      { id: 4, name: 'Shipped' },
      { id: 5, name: 'In Transit' },
      { id: 6, name: 'Out for Delivery' },
      { id: 7, name: 'Delivered' }
    ];

    return (
      <div className="order-status-tracker" style={{ overflowX: 'auto', paddingBottom: '16px' }}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`tracker-step ${getStatusStepClass(currentStatus, step.name)}`} style={{ minWidth: '80px' }}>
              <div className="tracker-bullet">{step.id}</div>
              <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`tracker-line ${getStatusStepClass(currentStatus, steps[index + 1].name)}`} style={{ minWidth: '30px', flex: 1 }}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner-wrapper">
        <div className="spinner"></div>
        <p>Retrieving order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
        <div className="error-state glass-panel">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container animate-fade-in">
      <h1>Your Order History</h1>

      {orders.length === 0 ? (
        <div className="empty-orders-state glass-panel empty-state">
          <Package size={64} className="text-muted empty-icon" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h2 className="text-h2">You haven't placed an order yet.</h2>
          <p className="text-body text-muted" style={{ marginBottom: '24px' }}>Once you place an order, you can track its status here.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Explore Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div key={order.id} className="order-card-wrapper glass-panel">
                <div className="order-card-header" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="order-meta-info">
                    <span className="order-id-badge">Order #{order.id}</span>
                    <div className="order-date">
                      <Calendar size={14} className="text-muted" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="order-financial-info">
                    <span className="order-total-price">${parseFloat(order.total).toFixed(2)}</span>
                    <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-coral'}`}>
                      {order.status}
                    </span>
                  </div>

                  <button className="expand-order-btn" aria-label="Toggle details">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="order-card-details animate-scale-in">
                    {order.status !== 'Cancelled' ? (
                      renderTracker(order.status)
                    ) : (
                      <div className="order-cancelled-alert">
                        <span>This order has been Cancelled.</span>
                      </div>
                    )}

                    <div className="details-content-grid">
                      <div className="details-products-panel">
                        <h4>Order Items</h4>
                        {detailsLoading ? (
                          <div className="mini-spinner"></div>
                        ) : orderDetails && orderDetails.OrderItems ? (
                          <div className="details-items-list">
                            {orderDetails.OrderItems.map((item) => (
                              <div key={item.id} className="details-item-row">
                                <span className="item-name-qty">
                                  {item.Product ? item.Product.name : 'Unknown Product'} <strong>x{item.quantity}</strong>
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>Failed to load items</p>
                        )}
                      </div>

                      <div className="details-shipping-panel">
                        <h4>Shipping Address</h4>
                        <div className="shipping-info-block">
                          <p><strong>Recipient:</strong> {order.name}</p>
                          <p><strong>Address:</strong> {order.address}</p>
                          <p><strong>City/Postal:</strong> {order.city}, {order.postalCode}</p>
                          <p><strong>Country:</strong> {order.country}</p>
                          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
