import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import '../styles/product-universe.css';

const ProductUniverse = ({ currentProduct, relatedProducts }) => {
  if (!currentProduct || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  // Define some relationships for spatial distribution
  const relationshipTypes = ['Similar', 'Alternative', 'Premium', 'Accessories'];
  
  return (
    <div className="product-universe-container">
      <div className="universe-header">
        <Sparkles size={20} className="text-accent" />
        <h3>Product Universe</h3>
        <p>Explore spatial connections around this product.</p>
      </div>

      <div className="universe-canvas glass-panel">
        <div className="universe-center-node">
          <img src={currentProduct.image} alt={currentProduct.name} />
          <div className="node-label">Current</div>
        </div>

        {relatedProducts.slice(0, 4).map((product, index) => {
          // Distribute 4 products in a circle
          const angle = (index * 2 * Math.PI) / Math.min(relatedProducts.length, 4);
          const radius = 140; // pixels
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const relType = relationshipTypes[index % relationshipTypes.length];

          return (
            <React.Fragment key={product.id}>
              {/* SVG Line connecting center to node */}
              <svg className="universe-line" style={{ left: `calc(50% + ${x/2}px)`, top: `calc(50% + ${y/2}px)` }}>
                <line x1="0" y1="0" x2={x} y2={y} stroke="rgba(var(--text-rgb), 0.2)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
              
              <Link
                to={`/product/${product.id}`}
                className="universe-node hover-lift"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
              >
                <img src={product.image} alt={product.name} />
                <div className="node-info">
                  <span className="node-rel badge">{relType}</span>
                  <span className="node-name">{product.name}</span>
                  <span className="node-price">${parseFloat(product.price).toFixed(2)}</span>
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProductUniverse;
