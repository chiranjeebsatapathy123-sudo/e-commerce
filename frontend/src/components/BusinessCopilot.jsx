import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, Send, Loader, ArrowRight, Activity, TrendingUp, TrendingDown, PackageMinus } from 'lucide-react';

const BusinessCopilot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello Admin, I'm your Spark Business Copilot. How can I help you analyze the store today?",
      data: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/admin/copilot', { message: userMessage });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        data: response.data.data
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error trying to process your request. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderDataWidget = (dataPayload) => {
    if (!dataPayload) return null;

    const { type, data } = dataPayload;

    if (type === 'sales') {
      return (
        <div className="copilot-widget glass-panel" style={{ marginTop: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="metric-card" style={{ flex: 1, padding: '12px', background: 'var(--bg)' }}>
              <span className="text-muted text-small">Revenue</span>
              <h4 style={{ margin: '4px 0 0' }}>${data.revenue.toFixed(2)}</h4>
            </div>
            <div className="metric-card" style={{ flex: 1, padding: '12px', background: 'var(--bg)' }}>
              <span className="text-muted text-small">Orders</span>
              <h4 style={{ margin: '4px 0 0' }}>{data.orders}</h4>
            </div>
            <div className="metric-card" style={{ flex: 1, padding: '12px', background: 'var(--bg)' }}>
              <span className="text-muted text-small">Units Sold</span>
              <h4 style={{ margin: '4px 0 0' }}>{data.unitsSold}</h4>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'inventory') {
      return (
        <div className="copilot-widget glass-panel" style={{ marginTop: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="metric-card" style={{ flex: 1, padding: '12px', background: 'var(--bg)' }}>
              <span className="text-muted text-small">Low Stock</span>
              <h4 style={{ margin: '4px 0 0', color: 'var(--warning)' }}>{data.lowStock}</h4>
            </div>
            <div className="metric-card" style={{ flex: 1, padding: '12px', background: 'var(--bg)' }}>
              <span className="text-muted text-small">Out of Stock</span>
              <h4 style={{ margin: '4px 0 0', color: 'var(--danger)' }}>{data.outOfStock}</h4>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'risks') {
      return (
        <div className="copilot-widget glass-panel" style={{ marginTop: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px' }}>High Risk Products</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.slice(0, 3).map(risk => (
              <li key={risk.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--bg)', marginBottom: '8px', borderRadius: '4px' }}>
                <span>{risk.name}</span>
                <span className={`badge ${risk.severity === 'Critical' ? 'badge-coral' : 'badge-warning'}`}>
                  {risk.estimatedDaysRemaining} Days Left
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="copilot-container glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(var(--primary-hsl), 0.1), rgba(var(--accent-hsl), 0.1))', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sparkles className="text-primary" size={24} />
        <h3 style={{ margin: 0 }}>Business Copilot</h3>
      </div>
      
      <div className="copilot-messages" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.role}`} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--panel)',
              color: msg.role === 'user' ? 'white' : 'var(--text)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none'
            }}>
              {msg.content}
            </div>
            {msg.role === 'assistant' && renderDataWidget(msg.data)}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <Loader className="animate-spin text-primary" size={18} />
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['How are sales this month?', 'Which products need attention?', 'Show unusual sales activity.'].map((suggestion, i) => (
            <button 
              key={i}
              onClick={() => setInput(suggestion)}
              style={{ padding: '6px 12px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Copilot about sales, inventory, or trends..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary btn-icon" disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessCopilot;
