import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Package, ShoppingBag, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';

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
    <div className="bg-white min-h-screen text-black pb-20">
      <div className="max-w-[1000px] mx-auto pt-8 px-4">
        
        {/* Amazon-style Breadcrumb / Header */}
        <div className="text-sm text-blue-600 hover:underline cursor-pointer mb-2">Your Account</div>
        <h1 className="text-3xl font-medium text-gray-900 mb-6">Your Orders</h1>

        {/* Tabs */}
        <div className="border-b border-gray-300 flex gap-6 mb-6">
          <button className="pb-2 border-b-2 border-orange-500 text-gray-900 font-bold">Orders</button>
          <button className="pb-2 text-blue-600 hover:text-red-600 hover:underline font-medium">Buy Again</button>
          <button className="pb-2 text-blue-600 hover:text-red-600 hover:underline font-medium">Not Yet Shipped</button>
          <button className="pb-2 text-blue-600 hover:text-red-600 hover:underline font-medium">Cancelled Orders</button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span className="font-bold text-gray-900">1 order</span>
          <span className="text-gray-700">placed in</span>
          <select className="border border-gray-300 rounded-md py-1 px-2 bg-gray-50 text-gray-900 shadow-sm focus:outline-none focus:border-blue-500">
            <option>past 3 months</option>
            <option>past 6 months</option>
            <option>2023</option>
          </select>
        </div>

        {orders.length === 0 ? (
          <div className="border border-gray-300 rounded-lg p-10 text-center bg-gray-50">
            <h2 className="text-xl font-medium mb-4">You have not placed any orders.</h2>
            <button onClick={() => navigate('/')} className="bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-500 py-2 px-6 rounded-md shadow-sm">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <div key={order.id} className="border border-gray-300 rounded-lg overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 text-sm flex flex-wrap justify-between items-start text-gray-600">
                    <div className="flex gap-8">
                      <div>
                        <div className="uppercase mb-1">Order Placed</div>
                        <div className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div>
                        <div className="uppercase mb-1">Total</div>
                        <div className="text-gray-900">${parseFloat(order.total).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="uppercase mb-1">Ship To</div>
                        <div className="text-blue-600 hover:underline cursor-pointer">{order.name} <ChevronDown size={14} className="inline"/></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="uppercase mb-1">Order # {order.id}</div>
                      <div className="flex gap-2 justify-end">
                        <span className="text-blue-600 hover:underline cursor-pointer">View order details</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-blue-600 hover:underline cursor-pointer">Invoice</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 bg-white flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{order.status === 'Delivered' ? 'Delivered' : `Arriving ${new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}`}</h3>
                      
                      {/* Fake Items placeholder - since order items need a separate fetch in this codebase */}
                      <div className="flex gap-4 mb-4">
                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Package size={32} className="text-gray-400" />
                        </div>
                        <div>
                          <div className="text-blue-600 hover:underline hover:text-red-600 cursor-pointer text-sm font-medium">Items from your order</div>
                          <div className="text-xs text-gray-500 mt-1">Sold by: SparkCart</div>
                          <div className="text-xs text-gray-500">Return eligible through {new Date(Date.now() + 86400000 * 30).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                          <button onClick={() => toggleOrderDetails(order.id)} className="mt-2 text-sm bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] py-1 px-4 rounded-full shadow-sm">
                            {isExpanded ? 'Hide Details' : 'View Items'}
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                         <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                           {detailsLoading ? (
                              <p className="text-sm text-gray-500">Loading items...</p>
                           ) : orderDetails && orderDetails.OrderItems ? (
                              <div className="space-y-3">
                                {orderDetails.OrderItems.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                    <span className="font-medium">{item.Product ? item.Product.name : 'Unknown Product'} <span className="text-gray-500">x{item.quantity}</span></span>
                                    <span className="text-red-700 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                           ) : (
                             <p className="text-sm text-red-500">Failed to load items.</p>
                           )}
                         </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] py-1.5 px-4 rounded-full shadow-sm text-sm font-medium">Track package</button>
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-1.5 px-4 rounded-full shadow-sm text-sm font-medium">Return or replace items</button>
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-1.5 px-4 rounded-full shadow-sm text-sm font-medium">Share gift receipt</button>
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-1.5 px-4 rounded-full shadow-sm text-sm font-medium">Write a product review</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
