import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, Calendar, RefreshCcw, Coffee, Sparkles, CheckCircle2, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Subscriptions = ({ userInfo }) => {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      id: "sub-1",
      name: "Spark Premium Coffee Blend",
      tagline: "Freshly roasted. Delivered monthly.",
      price: 24.99,
      frequency: "Monthly",
      discount: "Save 15%",
      image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500",
      perks: ["Free Shipping", "Exclusive early access to new blends", "Cancel anytime"]
    },
    {
      id: "sub-2",
      name: "Ultimate Wellness Box",
      tagline: "Vitamins & Supplements",
      price: 49.99,
      frequency: "Bi-Weekly",
      discount: "Save 20%",
      image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500",
      perks: ["Personalized to your health profile", "20% off retail price", "Free health consultation every 6 months"]
    },
    {
      id: "sub-3",
      name: "Home Essentials Replenish",
      tagline: "Cleaning & Paper Products",
      price: 35.00,
      frequency: "Monthly",
      discount: "Save 10%",
      image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500",
      perks: ["Eco-friendly packaging", "Set and forget", "Never run out of basics"]
    }
  ];

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-24 flex items-center justify-center font-sans">
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center max-w-lg shadow-xl">
          <RefreshCcw size={64} className="mx-auto text-rose-500 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Spark Subscriptions</h2>
          <p className="text-gray-600 mb-8">Sign in to manage your recurring deliveries, pause subscriptions, or discover new boxes.</p>
          <button 
            onClick={() => navigate('/login?redirect=/subscriptions')}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-rose-600/30"
          >
            Sign in to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-900 to-pink-900 text-white rounded-3xl p-10 md:p-16 mb-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -mr-48 -mt-48 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-200 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-6 border border-rose-500/30">
                <RefreshCcw size={16} /> Subscribe & Save
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-200">
                Set it. Forget it. <br/>Save automatically.
              </h1>
              <p className="text-xl text-rose-100/80 font-medium mb-8">
                Get your favorite products delivered exactly when you need them. Enjoy up to 20% off plus free shipping on all subscriptions.
              </p>
              <button className="bg-white text-rose-900 font-black px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center gap-2">
                Explore Subscription Boxes <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h4 className="font-bold flex items-center gap-2 mb-2"><CheckCircle2 className="text-rose-400" size={20}/> Ultimate Flexibility</h4>
                <p className="text-sm text-rose-100/70">Skip a delivery, change your frequency, or cancel anytime with zero fees.</p>
              </div>
              <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h4 className="font-bold flex items-center gap-2 mb-2"><Zap className="text-yellow-400" size={20}/> Price Lock Guarantee</h4>
                <p className="text-sm text-rose-100/70">Once subscribed, your discounted price is locked in for a full year.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Area (If User Has Subs) */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900">Your Active Subscriptions</h2>
            <button className="text-sm font-bold text-rose-600 hover:text-rose-700">Manage All</button>
          </div>
          
          {/* Mock active subscription */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <div className="w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500" alt="Coffee" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold inline-block mb-3 uppercase tracking-wider">
                Active • Monthly
              </div>
              <h3 className="text-xl font-bold mb-1">Spark Premium Coffee Blend</h3>
              <p className="text-slate-500 text-sm mb-4">Qty: 2 Bags • Ground • Dark Roast</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-slate-400" /> Next Delivery: Oct 15
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-slate-400" /> Price locked at $24.99
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Skip Next Delivery
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors">
                Edit Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Discovery Area */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-8">Discover Popular Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptionPlans.map(plan => (
              <div key={plan.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <div className="absolute top-4 left-4 z-10 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-lg">
                    {plan.discount}
                  </div>
                  <img src={plan.image} alt={plan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">{plan.tagline}</p>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                        <span className="text-sm text-slate-500 font-bold"> / {plan.frequency.toLowerCase()}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="mt-auto w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-xl shadow-[0_5px_15px_rgba(225,29,72,0.3)] transition-all">
                    Subscribe Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscriptions;
