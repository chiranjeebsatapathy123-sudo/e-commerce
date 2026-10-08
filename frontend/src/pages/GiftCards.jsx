import React, { useState } from 'react';
import { Gift, Copy, CreditCard, Send, Mail, Calendar as CalendarIcon, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GiftCards = ({ userInfo }) => {
  const [amount, setAmount] = useState(50);
  const [selectedDesign, setSelectedDesign] = useState('birthday');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const designs = [
    { id: 'birthday', name: 'Birthday', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', colors: 'from-pink-500 to-rose-500' },
    { id: 'thankyou', name: 'Thank You', img: 'https://images.unsplash.com/photo-1602492160912-32a22055620b?w=400', colors: 'from-amber-400 to-orange-500' },
    { id: 'holiday', name: 'Holiday', img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400', colors: 'from-emerald-500 to-teal-600' },
    { id: 'classic', name: 'Classic Spark', img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=400', colors: 'from-blue-600 to-indigo-700' },
  ];

  const currentDesign = designs.find(d => d.id === selectedDesign);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
            Digital Gift Cards
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Give the perfect gift instantly. Personalize your eGift card, add a message, and send it directly to their inbox or schedule it for a special day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Card Preview & Selection */}
          <div className="space-y-8">
            
            {/* The Gift Card Preview */}
            <motion.div 
              className={`w-full aspect-[1.6/1] bg-gradient-to-br ${currentDesign.colors} rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between`}
              key={currentDesign.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <img src={currentDesign.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="font-black text-2xl text-white tracking-widest uppercase">SPARK</div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">
                  eGift Card
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-white/80 font-medium mb-1">Gift Amount</p>
                <h3 className="text-5xl font-black text-white">${amount}</h3>
                {message && (
                  <p className="mt-4 text-white font-medium italic">"{message}"</p>
                )}
              </div>
            </motion.div>

            {/* Design Selector */}
            <div>
              <h3 className="text-lg font-bold mb-4">Choose a Design</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {designs.map(design => (
                  <button 
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`w-24 shrink-0 aspect-[1.6/1] rounded-xl overflow-hidden relative border-4 transition-all ${selectedDesign === design.id ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${design.colors}`}></div>
                    <img src={design.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Form Setup */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-8 text-slate-900">Card Details</h3>
            
            {/* Amount Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Amount</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {[25, 50, 100, 200, 500].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm border-2 transition-all ${amount === val ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Custom Amount" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="friend@example.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Personal Message</label>
                <textarea 
                  rows="3" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday! Treat yourself to something nice." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Delivery Date */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Leave blank to send instantly after purchase.</p>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              <CreditCard size={20} /> Checkout & Send
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">Gift cards never expire and carry no fees.</p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GiftCards;
