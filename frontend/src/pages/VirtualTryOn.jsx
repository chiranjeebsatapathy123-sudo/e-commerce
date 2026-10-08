import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Maximize, Smartphone, Zap, Eye, Download, Share2, Info } from 'lucide-react';

const VirtualTryOn = () => {
  const [activeCategory, setActiveCategory] = useState('glasses');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const categories = [
    { id: 'glasses', name: 'Eyewear' },
    { id: 'makeup', name: 'Makeup & Beauty' },
    { id: 'jewelry', name: 'Jewelry & Watches' },
    { id: 'sneakers', name: 'Sneakers (AR Foot)' },
  ];

  const products = {
    glasses: [
      { id: 'g1', name: 'Classic Aviators', price: 120, brand: 'Ray-Ban', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200' },
      { id: 'g2', name: 'Retro Square', price: 95, brand: 'Warby Parker', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200' },
      { id: 'g3', name: 'Geometric Wire', price: 140, brand: 'Oliver Peoples', img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=200' },
    ],
    makeup: [
      { id: 'm1', name: 'Velvet Matte Lipstick (Ruby)', price: 35, brand: 'MAC', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200' },
      { id: 'm2', name: 'Liquid Foundation', price: 42, brand: 'Fenty', img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200' },
    ],
    jewelry: [
      { id: 'j1', name: 'Diamond Tennis Necklace', price: 4500, brand: 'Tiffany', img: 'https://images.unsplash.com/photo-1599643478514-4a410f060896?w=200' },
      { id: 'j2', name: 'Chronograph Watch', price: 2100, brand: 'Omega', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200' },
    ],
    sneakers: [
      { id: 's1', name: 'Air Max 97', price: 170, brand: 'Nike', img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200' },
      { id: 's2', name: 'Yeezy Boost 350', price: 220, brand: 'Adidas', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200' },
    ]
  };

  useEffect(() => {
    // Select first product by default when category changes
    setSelectedProduct(products[activeCategory][0]);
    // Simulate model loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 flex flex-col font-sans">
      
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-20 z-20">
        <div className="flex items-center gap-2">
          <Eye className="text-blue-400" />
          <h1 className="text-xl font-black uppercase tracking-widest">AR Try-On Mirror</h1>
        </div>
        <div className="hidden md:flex bg-white/10 p-1 rounded-xl">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Categories */}
      <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b border-white/5 bg-[#0a0a0a]">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Main AR Viewport */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden flex items-center justify-center min-h-[500px] lg:min-h-full">
          
          {/* Scanning/Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-blue-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading AI Mesh Models...</p>
            </div>
          )}
          
          {/* Mock Camera Feed or Placeholder Image */}
          {!cameraActive ? (
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1000')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
          ) : (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center flex-col gap-4">
              <Camera size={48} className="text-gray-500 animate-pulse" />
              <p className="text-gray-500 font-mono text-sm">Awaiting Webcam Access...</p>
            </div>
          )}

          {/* AR Overlay UI */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Focus brackets */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
            <div className="absolute top-1/4 right-1/4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
            <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
            <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>
            
            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-50">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>

            {/* Smart Detection Info */}
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <Zap className="text-yellow-400 animate-pulse" size={16} />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Face Mesh</p>
                <p className="text-xs text-white font-mono">Tracking Active (60fps)</p>
              </div>
            </div>
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={toggleCamera}
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${cameraActive ? 'bg-red-500 border-red-400' : 'bg-white text-black border-white hover:scale-105'}`}
            >
              <Camera size={24} className={cameraActive ? 'text-white' : ''} />
            </button>
            <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Maximize size={20} />
            </button>
          </div>
          
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
            <button className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-white border border-white/10">
              <Download size={16} />
            </button>
            <button className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 hover:text-white border border-white/10">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Product Selection Sidebar */}
        <div className="w-full lg:w-96 bg-[#0a0a0a] border-t lg:border-l border-white/10 flex flex-col">
          
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold mb-1">Select Item</h2>
            <p className="text-xs text-gray-400">Tap to instantly preview in AR</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {products[activeCategory].map(product => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-all border ${selectedProduct?.id === product.id ? 'bg-blue-500/10 border-blue-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
              >
                <div className="w-20 h-20 bg-black rounded-lg overflow-hidden shrink-0 border border-white/5">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{product.brand}</p>
                  <h4 className="font-bold text-sm text-white mb-2 leading-tight">{product.name}</h4>
                  <p className="font-mono text-sm text-blue-400">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          {selectedProduct && (
            <div className="p-6 bg-gradient-to-t from-black to-[#0a0a0a] border-t border-white/10 mt-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedProduct.brand}</p>
                </div>
                <p className="text-xl font-black">${selectedProduct.price}</p>
              </div>
              <button className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Add to Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
