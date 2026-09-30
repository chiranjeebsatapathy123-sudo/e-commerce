import React, { useState } from 'react';
import { Camera, X, UploadCloud, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImageSearchModal = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateSearch = (file) => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onClose();
      // Navigate to search results with a mock query just to show functionality
      navigate('/?q=visually+similar');
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateSearch(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateSearch(e.target.files[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} className="btn-icon-only" style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>
        
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={24} className="text-primary" /> Visual Search</h2>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Upload an image to find visually similar products from our catalog.</p>

        {analyzing ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p>Analyzing image features...</p>
          </div>
        ) : (
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ 
              border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`, 
              borderRadius: 'var(--radius-md)', 
              padding: '48px 24px', 
              textAlign: 'center',
              background: dragActive ? 'rgba(var(--primary-hsl), 0.05)' : 'rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease'
            }}
          >
            <UploadCloud size={48} className={dragActive ? 'text-primary' : 'text-muted'} style={{ margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Drag & drop an image here</h3>
            <p className="text-muted" style={{ marginBottom: '16px' }}>or</p>
            <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              Choose File
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchModal;
