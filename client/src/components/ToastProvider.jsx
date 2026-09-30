import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none', alignItems: 'center' }}>
        {toasts.map(toast => (
          <div key={toast.id} className="toast animate-fade-in" style={{ padding: '12px 24px', background: toast.type === 'error' ? 'var(--danger)' : 'var(--panel)', color: toast.type === 'error' ? 'white' : 'var(--text)', borderRadius: 'var(--radius-full)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '8px', border: toast.type !== 'error' ? '1px solid var(--border)' : 'none' }}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '8px' }}>&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
