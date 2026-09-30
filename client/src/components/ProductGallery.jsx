import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const ProductGallery = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, currentIndex, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} className="btn-icon-only" style={{ position: 'absolute', top: '24px', right: '24px', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}>
        <X size={24} />
      </button>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prevImage} className="btn-icon-only" style={{ position: 'absolute', left: '24px', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}>
            <ChevronLeft size={32} />
          </button>
        )}
        
        <img src={images[currentIndex]} alt={`Gallery ${currentIndex}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }} />

        {images.length > 1 && (
          <button onClick={nextImage} className="btn-icon-only" style={{ position: 'absolute', right: '24px', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}>
            <ChevronRight size={32} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', overflowX: 'auto', padding: '16px', maxWidth: '100%' }} onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <div key={i} onClick={() => setCurrentIndex(i)} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: i === currentIndex ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', opacity: i === currentIndex ? 1 : 0.5, transition: 'all 0.2s' }}>
              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
