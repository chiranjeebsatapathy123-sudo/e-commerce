import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, HelpCircle, Trophy, Sparkles, ChevronRight, Lock, Unlock, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MysteryBox = ({ userInfo }) => {
  const navigate = useNavigate();
  const [openingBox, setOpeningBox] = useState(null);
  const [wonItem, setWonItem] = useState(null);

  const boxes = [
    {
      id: "mb-1",
      name: "Sneakerhead Grail Box",
      price: 299,
      level: "Elite",
      color: "from-blue-600 to-indigo-800",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
      guarantees: "1 Guaranteed Authenticated Sneaker. 10% chance of a Grail (Value $1000+).",
      prizes: [
        { name: "Jordan 1 Retro High", value: 450, image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=200" },
        { name: "Yeezy Boost 350", value: 300, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200" },
        { name: "Off-White x Nike Dunk", value: 1200, image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=200" },
        { name: "Nike Dunk Low Panda", value: 250, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200" },
      ]
    },
    {
      id: "mb-2",
      name: "Tech Enthusiast Drop",
      price: 149,
      level: "Premium",
      color: "from-emerald-500 to-teal-800",
      image: "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=500",
      guarantees: "1 Guaranteed Premium Tech Accessory. 5% chance of an Apple Product.",
      prizes: [
        { name: "AirPods Pro", value: 249, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200" },
        { name: "Mechanical Keyboard", value: 180, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=200" },
        { name: "MacBook Air M2", value: 1199, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" },
        { name: "Sony WH-1000XM5", value: 398, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200" },
      ]
    }
  ];

  const handleOpenBox = (box) => {
    if (!userInfo) {
      navigate('/login?redirect=/mystery-box');
      return;
    }
    
    // Simulate transaction and opening sequence
    setOpeningBox(box.id);
    setWonItem(null);
    
    setTimeout(() => {
      // Pick random prize based on weighted probabilities
      const random = Math.random();
      let prize;
      if (random < 0.1) prize = box.prizes[2]; // 10% chance Grail
      else if (random < 0.4) prize = box.prizes[0];
      else if (random < 0.7) prize = box.prizes[3];
      else prize = box.prizes[1];
      
      setWonItem(prize);
    }, 4500); // 4.5 seconds suspense
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 font-sans text-white overflow-hidden relative">
      
      {/* Dynamic BG */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-6">
            <Sparkles size={16} /> Spark Loot Drops
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-gray-600">
            Unbox the Unexpected.
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Purchase a Mystery Box to unlock guaranteed value with a chance to win exclusive Grails worth up to 10x the price.
          </p>
        </div>

        {/* Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {boxes.map((box) => (
            <div key={box.id} className="relative group perspective-1000">
              
              {/* Box Card */}
              <div className={`relative bg-gradient-to-br ${box.color} p-1 rounded-3xl overflow-hidden transition-transform duration-700 transform-style-3d ${openingBox === box.id && !wonItem ? 'animate-shake' : 'group-hover:rotate-y-12'}`}>
                <div className="bg-black/90 backdrop-blur-xl h-full w-full rounded-[23px] p-8 flex flex-col relative overflow-hidden">
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-[50px] rounded-full pointer-events-none"></div>
                  
                  {/* Status Overlay when Opening */}
                  <AnimatePresence>
                    {openingBox === box.id && !wonItem && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
                      >
                        <div className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h2 className="text-3xl font-black animate-pulse text-yellow-400 tracking-wider">UNLOCKING...</h2>
                        <p className="text-white mt-2 font-medium">Authorizing smart contract & rolling drop algorithm</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Won Item Overlay */}
                  <AnimatePresence>
                    {openingBox === box.id && wonItem && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-50 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="absolute top-0 w-full h-full bg-[url('https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif')] opacity-20 mix-blend-screen pointer-events-none"></div>
                        
                        <div className="inline-flex bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm font-bold uppercase mb-6 border border-green-500/50">
                          Drop Secured
                        </div>
                        
                        <img src={wonItem.image} alt={wonItem.name} className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6" />
                        
                        <h2 className="text-3xl font-black text-white mb-2">{wonItem.name}</h2>
                        <p className="text-xl text-gray-400 mb-8">Est. Value: <span className="text-green-400 font-bold">${wonItem.value}</span></p>
                        
                        <div className="flex gap-4 w-full">
                          <button onClick={() => setOpeningBox(null)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-colors">
                            Close
                          </button>
                          <button onClick={() => alert('Item transferred to your Vault!')} className="flex-1 bg-white text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
                            Claim to Vault
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Standard Box View */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider inline-block mb-3">
                        {box.level} Tier
                      </div>
                      <h2 className="text-3xl font-black text-white">{box.name}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-400 font-bold block mb-1">Price</span>
                      <span className="text-3xl font-black text-white">${box.price}</span>
                    </div>
                  </div>

                  <div className="h-48 relative mb-8 flex justify-center items-center z-10 group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute w-32 h-32 bg-white/10 blur-[40px] rounded-full"></div>
                    <Package size={120} className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 z-10">
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                      {box.guarantees}
                    </p>
                  </div>

                  <div className="mt-auto z-10">
                    <button 
                      onClick={() => handleOpenBox(box)}
                      disabled={openingBox === box.id}
                      className={`w-full bg-gradient-to-r ${box.color} hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-white font-black py-5 rounded-xl text-lg flex items-center justify-center gap-2 transition-all group-hover:bg-white group-hover:text-black`}
                    >
                      <Unlock size={20} /> Open Box for ${box.price}
                    </button>
                  </div>

                </div>
              </div>

              {/* Potential Prizes Preview (Shows below the box) */}
              <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Gem size={16} /> Possible Drops
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {box.prizes.map((prize, idx) => (
                    <div key={idx} className="bg-black/50 rounded-xl p-2 border border-white/5 text-center group/item hover:bg-white/10 transition-colors relative cursor-help" title={`${prize.name} - Est. Value $${prize.value}`}>
                      <img src={prize.image} alt={prize.name} className="w-full h-16 object-cover rounded-lg mb-2" />
                      <div className="text-[10px] text-gray-400 font-bold truncate">{prize.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MysteryBox;
