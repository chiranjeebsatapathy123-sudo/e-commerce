import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-brand-section">
          <h3>SparkCart</h3>
          <p>Delivering high-fidelity products, seamless user experiences, and premium aesthetics straight to your door.</p>
        </div>
        
        <div className="footer-links-section">
          <h4>Shop Categories</h4>
          <ul>
            <li><Link to="/?category=Electronics">Electronics</Link></li>
            <li><Link to="/?category=Fashion">Fashion</Link></li>
            <li><Link to="/?category=Home">Home & Living</Link></li>
          </ul>
        </div>
        
        <div className="footer-links-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/orders">Order Tracking</Link></li>
            <li><a href="#privacy">Privacy & Security</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SparkCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
