import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/background.css';

const BackgroundEngine = ({ theme }) => {
  const location = useLocation();
  const [mode, setMode] = useState('ambient');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    // Determine background mode based on route
    const path = location.pathname;
    if (path.includes('/ai') || path.includes('/workspace')) {
      setMode('dynamic');
    } else if (path.includes('/admin')) {
      setMode('analytical');
    } else if (path.includes('/checkout') || path.includes('/cart')) {
      setMode('minimal');
    } else if (path.includes('/product')) {
      setMode('depth');
    } else {
      setMode('ambient');
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate as percentage of viewport
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`bg-engine mode-${mode} theme-${theme} ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
      <div className="bg-ambient-layer"></div>
      
      {/* Spotlight Cursor Effect */}
      <div 
        className="bg-cursor-spotlight"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 40%)`,
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="bg-light-field"></div>
      <div className="bg-noise-layer"></div>
      
      {/* Conditionally render complex layers based on mode */}
      {(mode === 'dynamic' || mode === 'ambient') && !prefersReducedMotion && (
        <div className="bg-particle-field"></div>
      )}
      
      {mode === 'analytical' && (
        <div className="bg-grid-layer"></div>
      )}
      
      {mode === 'depth' && (
        <div className="bg-depth-layer"></div>
      )}
    </div>
  );
};

export default BackgroundEngine;
