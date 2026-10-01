import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, Mic, RefreshCw, ShoppingCart, Info, StopCircle, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const AiCopilot = ({ addToCart, toggleWishlist, wishlist }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Spark AI, your personal shopping assistant. What are you looking for today?",
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Real products data loaded dynamically if the AI returns product IDs
  const [productCache, setProductCache] = useState({});
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    // Initialize Speech Recognition if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setInput(prev => prev + ' ' + finalTranscript.trim());
        } else if (interimTranscript) {
          // Could display interim somewhere if we want
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support voice recognition.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const fetchProductsDetails = async (productIds) => {
    const newProducts = {};
    const idsToFetch = productIds.filter(id => !productCache[id]);
    
    if (idsToFetch.length > 0) {
      try {
        const { data } = await api.get('/products', { params: { limit: 100 } });
        // In a real app we'd fetch by IDs specifically, but for now we filter from catalog
        idsToFetch.forEach(id => {
          const prod = data.products.find(p => p.id === id);
          if (prod) newProducts[id] = prod;
        });
        setProductCache(prev => ({ ...prev, ...newProducts }));
      } catch (err) {
        console.error('Failed to fetch product details for AI response', err);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: 'user', content: userText }
    ];
    setMessages(newMessages);
    
    setLoading(true);
    setLoadingStage('Understanding your request...');
    
    try {
      // Simulate staging for a premium feel
      setTimeout(() => setLoadingStage('Searching products...'), 800);
      setTimeout(() => setLoadingStage('Comparing options...'), 1600);
      
      const historyForApi = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      const { data } = await api.post('/ai/chat', { 
        message: userText, 
        history: historyForApi.slice(0, -1) 
      });
      
      if (data.status === 'success') {
        if (data.products && data.products.length > 0) {
          await fetchProductsDetails(data.products);
        }
        
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: data.message,
            products: data.products || [],
            confidence: data.confidence,
            uiComponent: data.uiComponent // Generative UI injection
          }
        ]);
      } else {
        throw new Error(data.message || 'Error communicating with AI');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: err.response?.data?.message || err.message || 'Spark AI is temporarily unavailable.',
          error: true
        }
      ]);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm Spark AI, your personal shopping assistant. What are you looking for today?",
        products: []
      }
    ]);
  };

  const renderProductCards = (productIds) => {
    if (!productIds || productIds.length === 0) return null;
    
    return (
      <div className="ai-product-suggestions">
        {productIds.map(id => {
          const product = productCache[id];
          if (!product) return null;
          
          const isWishlisted = wishlist?.some(item => item.id === product.id);
          
          return (
            <div key={id} className="ai-product-card glass-panel">
              <Link to={`/product/${product.id}`} className="ai-product-img">
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="ai-product-info">
                <h4>{product.name}</h4>
                <div className="ai-product-price">${parseFloat(product.price).toFixed(2)}</div>
                <div className="ai-product-actions">
                  <button onClick={() => addToCart(product)} className="btn btn-primary btn-sm flex-1">
                    <ShoppingCart size={14} /> Add
                  </button>
                  <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm">
                    <Info size={14} /> View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDynamicUI = (uiType, props) => {
    if (!uiType) return null;

    if (uiType === 'DistanceCalculator') {
      return (
        <div className="generative-ui-component" style={{ marginTop: '16px', background: 'var(--panel)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h4 style={{ marginBottom: '12px' }}>TV Viewing Distance Calculator</h4>
          <input type="range" min="30" max="100" defaultValue="55" onChange={(e) => {
            const size = e.target.value;
            const distance = (size * 1.2 / 12).toFixed(1);
            document.getElementById('calc-result').innerText = `Recommended distance for ${size}" TV is ~${distance} ft`;
          }} style={{ width: '100%', marginBottom: '12px' }} />
          <p id="calc-result" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Recommended distance for 55" TV is ~5.5 ft</p>
        </div>
      );
    }
    
    // Add more generative components here...
    return null;
  };

  return (
    <div className="ai-copilot-page container animate-fade-in" style={{ padding: '24px 12px' }}>
      <div className="ai-chat-container glass-panel">
        
        {/* Header */}
        <div className="ai-chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="ai-spark-icon" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '8px', borderRadius: '50%', color: 'white' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Spark AI <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>BETA</span>
              </h2>
              <span className="text-small text-muted">Your personal shopping assistant</span>
            </div>
          </div>
          <button onClick={clearChat} className="btn btn-secondary btn-sm" title="Clear Conversation">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="ai-chat-messages" style={{ padding: '24px', height: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`ai-message-wrapper ${msg.role === 'user' ? 'user-msg' : 'assistant-msg'}`} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className="ai-message-bubble" style={{
                maxWidth: '85%',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--panel-alt)',
                color: msg.role === 'user' ? 'white' : 'var(--text)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                borderBottomRightRadius: msg.role === 'user' ? '0' : 'var(--radius-lg)',
                borderBottomLeftRadius: msg.role === 'assistant' ? '0' : 'var(--radius-lg)',
              }}>
                <div style={{ lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
                
                {msg.role === 'assistant' && msg.uiComponent && renderDynamicUI(msg.uiComponent.type, msg.uiComponent.props)}
                
                {msg.role === 'assistant' && msg.confidence !== undefined && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} className={msg.confidence > 0.7 ? "text-success" : "text-warning"} />
                      {msg.confidence > 0.7 ? "High Confidence" : "Limited Information"}
                    </span>
                    <span>AI-Generated Response</span>
                  </div>
                )}
              </div>
              
              {/* Product Cards Attachment */}
              {msg.products && msg.products.length > 0 && (
                <div style={{ marginTop: '12px', width: '100%' }}>
                  {renderProductCards(msg.products)}
                </div>
              )}

              {/* Try Again / Error State */}
              {msg.error && (
                <button onClick={() => setMessages(messages.slice(0, -1))} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
                  <RefreshCw size={14} /> Try Again
                </button>
              )}
            </div>
          ))}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="ai-message-wrapper assistant-msg" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="ai-typing-indicator" style={{ background: 'var(--panel-alt)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', borderBottomLeftRadius: '0' }}>
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <span className="text-small text-muted animate-pulse">{loadingStage}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ai-chat-input-area" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--panel-alt)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={toggleListening}
              className={`ai-mic-btn ${isListening ? 'listening active' : 'text-muted'}`} 
              title={isListening ? "Stop listening" : "Start voice search"} 
              style={{ background: isListening ? 'rgba(var(--primary-hsl), 0.1)' : 'none', border: 'none', cursor: 'pointer', color: isListening ? 'var(--primary)' : 'inherit', padding: '8px', borderRadius: '50%' }}
            >
              {isListening ? <StopCircle size={24} /> : <Mic size={24} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me what you're looking for..."
              className="input-field"
              style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '12px 24px' }}
              disabled={loading}
            />
            {loading ? (
              <button type="button" className="btn btn-secondary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StopCircle size={20} />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} />
              </button>
            )}
          </form>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span className="text-caption text-muted">Spark AI can make mistakes. Check important information.</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AiCopilot;
