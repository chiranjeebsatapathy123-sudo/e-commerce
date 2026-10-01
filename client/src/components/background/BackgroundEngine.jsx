import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/background.css';

const BackgroundEngine = ({ theme }) => {
  const location = useLocation();
  const [mode, setMode] = useState('ambient');
  
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

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`bg-engine mode-${mode} theme-${theme} ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
      <div className="bg-ambient-layer"></div>
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
