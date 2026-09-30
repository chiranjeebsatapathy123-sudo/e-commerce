import React, { useState } from 'react';
import { Sparkles, X, Send, Mic, Camera } from 'lucide-react';
import api from '../services/api';

const SparkAIFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', content: 'Hi! I am Spark AI. How can I assist you today?' }]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { 
        message: userMsg.content, 
        history: messages.filter(m => m.role !== 'system') 
      });
      setMessages(prev => [...prev, { role: 'ai', content: data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'I am currently unavailable.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="spark-ai-fab glass-panel"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(var(--primary-hsl), 0.3)',
          border: 'none'
        }}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {isOpen && (
        <div className="spark-ai-panel glass-panel animate-fade-in" style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '350px',
          height: '500px',
          borderRadius: 'var(--radius-lg)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.2)'
        }}>
          <div style={{ padding: '16px', background: 'rgba(var(--primary-hsl), 0.1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} className="text-primary" />
            <strong style={{ flex: 1 }}>Spark AI</strong>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: m.role === 'user' ? 'var(--primary)' : 'var(--panel)', color: m.role === 'user' ? 'white' : 'var(--text)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--panel)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                <span className="pulse-anim">Thinking...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel)' }}>
            <button type="button" className="btn-icon-only" style={{ color: 'var(--text-muted)' }}><Camera size={18}/></button>
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Ask anything..." 
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text)' }}
            />
            <button type="button" className="btn-icon-only" style={{ color: 'var(--text-muted)' }}><Mic size={18}/></button>
            <button type="submit" className="btn-icon-only" style={{ color: 'var(--primary)' }} disabled={loading}><Send size={18}/></button>
          </form>
        </div>
      )}
    </>
  );
};

export default SparkAIFab;
