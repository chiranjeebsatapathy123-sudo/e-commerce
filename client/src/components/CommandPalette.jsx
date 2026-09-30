import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Sparkles, LayoutDashboard, Home, X } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, userInfo }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : document.dispatchEvent(new CustomEvent('open-command-palette'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'home', name: 'Go Home', icon: <Home size={16}/>, action: () => navigate('/') },
    { id: 'cart', name: 'Open Cart', icon: <ShoppingCart size={16}/>, action: () => navigate('/cart') },
    { id: 'wishlist', name: 'Open Wishlist', icon: <Heart size={16}/>, action: () => navigate('/wishlist') },
    { id: 'orders', name: 'View Orders', icon: <User size={16}/>, action: () => navigate('/orders') },
    { id: 'ai', name: 'Ask Spark AI', icon: <Sparkles size={16}/>, action: () => navigate('/ai') },
  ];

  if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'Super Admin')) {
    commands.push({ id: 'admin', name: 'Admin Dashboard', icon: <LayoutDashboard size={16}/>, action: () => navigate('/admin') });
  }

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const handleExecute = (action) => {
    action();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', backdropFilter: 'blur(5px)' }}>
      <div className="command-palette-content glass-panel" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '600px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} className="text-muted" style={{ marginRight: '12px' }}/>
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', color: 'var(--text)' }}
          />
          <button onClick={onClose} className="btn-icon-only" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No commands found.</div>
          ) : (
            filteredCommands.map((cmd) => (
              <button 
                key={cmd.id} 
                onClick={() => handleExecute(cmd.action)}
                className="command-item hover-bg"
                style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text)', borderRadius: 'var(--radius-md)', gap: '12px', textAlign: 'left' }}
              >
                {cmd.icon} {cmd.name}
              </button>
            ))
          )}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span><kbd style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px' }}>↑</kbd> <kbd style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px' }}>↓</kbd> to navigate</span>
          <span><kbd style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px' }}>enter</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
