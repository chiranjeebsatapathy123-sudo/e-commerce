import React, { useRef, useState } from 'react';
import './HolographicCard.css';

const HolographicCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    // Tilt the card based on mouse position (max 15 degrees)
    setRotate({
      x: yPct * -20,
      y: xPct * 20
    });
    
    // Update glare position
    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div 
      className={`holographic-container ${className}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      <div className="holographic-content">
        {children}
      </div>
      
      {/* Glare effect */}
      <div 
        className="holographic-glare"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
        }}
      />
      
      {/* Shimmer / Rainbow Foil effect */}
      <div 
        className="holographic-foil"
        style={{
          opacity: glare.opacity * 0.3,
          backgroundPosition: `${glare.x}% ${glare.y}%`
        }}
      />
    </div>
  );
};

export default HolographicCard;
