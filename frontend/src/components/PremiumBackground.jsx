import React from 'react';
import './PremiumBackground.css';

const PremiumBackground = () => {
  return (
    <div className="premium-background">
      <div className="bg-layer layer-1-base"></div>
      <div className="bg-layer layer-2-gradient"></div>
      <div className="bg-layer layer-3-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      <div className="bg-layer layer-4-noise"></div>
    </div>
  );
};

export default PremiumBackground;
