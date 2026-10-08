import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Info, Maximize, Play, Pause } from 'lucide-react';
import '../styles/SpatialGallery.css';

const SpatialGallery = ({ addToCart }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // We use a high-quality open-source GLB model of a shoe/headphone for spatial demonstration
  const modelSrc = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
  // Fallback to a sneaker if needed: "https://modelviewer.dev/shared-assets/models/Shoe.glb"
  const sneakerModel = "https://modelviewer.dev/shared-assets/models/Shoe.glb";

  const product = {
    id: 999,
    name: "Aero-Strider Spatial Edition",
    price: 299.99,
    category: "Footwear",
    stock: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  };

  useEffect(() => {
    // Add immersive dark theme specifically for this route
    document.body.classList.add('spatial-mode-active');
    return () => {
      document.body.classList.remove('spatial-mode-active');
    };
  }, []);

  return (
    <div className="spatial-gallery-container animate-fade-in">
      <div className="spatial-overlay-ui">
        <button className="btn btn-secondary glass-panel btn-circle" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="spatial-product-info glass-panel">
          <span className="badge badge-primary glow-pulse" style={{ marginBottom: '10px' }}>SPATIAL COMMERCE</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', background: 'linear-gradient(45deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {product.name}
          </h1>
          <p className="text-muted" style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
            Experience the future of retail. Interact with the product in fully immersive 3D space. 
            Rotate, zoom, and explore every micro-detail before you buy.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>${product.price}</span>
            <button 
              className="btn btn-primary" 
              onClick={() => addToCart(product)}
              style={{ padding: '12px 24px', fontSize: '1.1rem', borderRadius: '30px' }}
            >
              <ShoppingCart size={18} /> Pre-Order Now
            </button>
          </div>
        </div>

        <div className="spatial-controls glass-panel">
          <button className="btn btn-secondary btn-circle" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause Rotation" : "Start Rotation"}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="btn btn-secondary btn-circle" onClick={() => document.getElementById('spatial-viewer').requestFullscreen()} title="Fullscreen AR">
            <Maximize size={18} />
          </button>
        </div>
      </div>

      <div className="model-container">
        {/* Using Google's model-viewer Web Component */}
        <model-viewer 
          id="spatial-viewer"
          src={sneakerModel} 
          alt="A 3D model of a spatial product" 
          auto-rotate={isPlaying ? "true" : "false"}
          camera-controls
          environment-image="neutral"
          shadow-intensity="1"
          exposure="1.2"
          camera-orbit="45deg 55deg 2.5m"
          style={{ width: '100%', height: '100vh', backgroundColor: '#050505' }}
        >
          {/* Interactive Hotspots */}
          <button 
            className="spatial-hotspot" 
            slot="hotspot-toe" 
            data-position="0.16 0.1 0.17" 
            data-normal="0.73 0.05 0.69"
            onClick={() => setActiveHotspot(activeHotspot === 'toe' ? null : 'toe')}
          >
            <div className={`hotspot-annotation ${activeHotspot === 'toe' ? 'active' : ''}`}>
              <h4>Breathable Mesh</h4>
              <p>Aerospace-grade woven fabric for maximum airflow.</p>
            </div>
          </button>

          <button 
            className="spatial-hotspot" 
            slot="hotspot-heel" 
            data-position="-0.16 0.1 -0.17" 
            data-normal="-0.5 0.5 -0.5"
            onClick={() => setActiveHotspot(activeHotspot === 'heel' ? null : 'heel')}
          >
            <div className={`hotspot-annotation ${activeHotspot === 'heel' ? 'active' : ''}`}>
              <h4>Zero-G Cushioning</h4>
              <p>Impact absorption engineered for zero gravity simulation.</p>
            </div>
          </button>

          <div className="progress-bar" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
        </model-viewer>
      </div>
    </div>
  );
};

export default SpatialGallery;
