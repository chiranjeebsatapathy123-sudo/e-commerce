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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
        {productIds.map(id => {
          const product = productCache[id];
          if (!product) return (
            <div key={id} className="animate-pulse flex space-x-4 border border-gray-200 rounded-xl p-4 w-full h-32 bg-gray-50"></div>
          );
          
          return (
            <div key={id} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-40 w-full bg-gray-100 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                <div className="font-bold text-lg text-gray-900 mb-3">${parseFloat(product.price).toFixed(2)}</div>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => addToCart(product)} className="flex-1 bg-black hover:bg-gray-800 text-white py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={14} /> Add
                  </button>
                  <Link to={`/product/${product.id}`} className="bg-gray-100 hover:bg-gray-200 text-black py-1.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                    <Info size={14} />
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
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Sparkles size={20} />
            </div>
            <h4 className="font-bold text-gray-900">TV Viewing Distance Calculator</h4>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>30"</span>
              <span>65"</span>
              <span>100"</span>
            </div>
            <input type="range" min="30" max="100" defaultValue="55" onChange={(e) => {
              const size = e.target.value;
              const distance = (size * 1.2 / 12).toFixed(1);
              document.getElementById('calc-result').innerText = `Recommended distance for ${size}" TV is ~${distance} ft`;
            }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div className="bg-blue-50 text-blue-800 rounded-lg p-3 text-center border border-blue-100">
            <p id="calc-result" className="font-bold">Recommended distance for 55" TV is ~5.5 ft</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* OpenAI Style Header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-900 font-bold text-lg tracking-tight hover:text-blue-600 transition-colors">
            Spark<span className="text-blue-600">Cart</span>
          </Link>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Spark AI</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium border border-gray-200">Beta</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={clearChat} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors" title="New Chat">
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area - Centered like ChatGPT */}
      <div className="flex-1 overflow-y-auto pb-32 pt-8 px-4 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Avatar for AI */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white mt-1">
                  <Sparkles size={16} />
                </div>
              )}

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                {/* Message Bubble */}
                <div className={`
                  relative px-5 py-3.5 text-[15px] leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm' 
                    : 'text-gray-800'
                  }
                `}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.role === 'assistant' && msg.uiComponent && renderDynamicUI(msg.uiComponent.type, msg.uiComponent.props)}
                  
                  {msg.role === 'assistant' && msg.confidence !== undefined && (
                    <div className="mt-3 pt-3 flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 size={12} className={msg.confidence > 0.7 ? "text-green-500" : "text-yellow-500"} />
                      <span>{msg.confidence > 0.7 ? "High Confidence Match" : "Generative Output"}</span>
                    </div>
                  )}
                </div>

                {/* Attached Products */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 w-full">
                    {renderProductCards(msg.products)}
                  </div>
                )}
                
                {msg.error && (
                  <button onClick={() => setMessages(messages.slice(0, -1))} className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <RefreshCw size={12} /> Retry request
                  </button>
                )}
              </div>

              {/* Avatar for User */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm text-white mt-1">
                  <span className="text-xs font-bold">U</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white mt-1">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div className="flex flex-col items-start max-w-[85%]">
                <div className="px-5 py-3.5 text-[15px] leading-relaxed text-gray-500 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm font-medium">{loadingStage}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom, ChatGPT style */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-6 px-4">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSend} className="relative flex items-center bg-white border border-gray-300 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] focus-within:shadow-[0_0_20px_rgba(0,0,0,0.08)] focus-within:border-gray-400 transition-all">
            
            <button 
              type="button" 
              onClick={toggleListening}
              className={`p-3 ml-2 rounded-full transition-colors ${isListening ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} 
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <StopCircle size={20} className="animate-pulse" /> : <Mic size={20} />}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Spark AI for recommendations, comparisons, or deals..."
              className="w-full py-4 px-3 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-base"
              disabled={loading}
            />
            
            <div className="pr-3 pl-2">
              <button 
                type="submit" 
                disabled={!input.trim() || loading} 
                className={`p-2 rounded-xl flex items-center justify-center transition-all ${!input.trim() || loading ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {loading ? <StopCircle size={18} /> : <Send size={18} />}
              </button>
            </div>
          </form>
          <div className="text-center mt-3 text-xs text-gray-400">
            Spark AI can make mistakes. Consider verifying important product details.
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AiCopilot;
