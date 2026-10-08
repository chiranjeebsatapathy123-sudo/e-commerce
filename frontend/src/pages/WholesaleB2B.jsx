import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, FileText, TrendingDown, Users, PackageOpen, Download, Search, CheckCircle, ChevronRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

const WholesaleB2B = ({ userInfo }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('catalog');

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 flex items-center justify-center font-sans">
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center max-w-lg shadow-xl">
          <Building size={64} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Spark B2B Wholesale</h2>
          <p className="text-gray-600 mb-8">Access tiered pricing, volume discounts, and enterprise-grade procurement tools.</p>
          <button 
            onClick={() => navigate('/login?redirect=/wholesale')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/30"
          >
            Sign in with Business Account
          </button>
        </div>
      </div>
    );
  }

  const catalog = [
    {
      id: "b2b-1",
      name: "Spark Smart Office Desk (Ergonomic)",
      sku: "SKU-OS-4421",
      msrp: 499,
      tiers: [
        { qty: "1-10", price: 450 },
        { qty: "11-50", price: 399 },
        { qty: "51+", price: 349 },
      ],
      stock: 4200,
      image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500"
    },
    {
      id: "b2b-2",
      name: "Commercial Grade Espresso Machine",
      sku: "SKU-CM-990",
      msrp: 1299,
      tiers: [
        { qty: "1-5", price: 1100 },
        { qty: "6-20", price: 950 },
        { qty: "21+", price: 850 },
      ],
      stock: 850,
      image: "https://images.unsplash.com/photo-1517246286411-8bb31be1b473?w=500"
    },
    {
      id: "b2b-3",
      name: "Bulk Noise Cancelling Headsets (10-Pack)",
      sku: "SKU-EL-77x10",
      msrp: 1500,
      tiers: [
        { qty: "1-5", price: 1200 },
        { qty: "6-20", price: 1000 },
        { qty: "21+", price: 850 },
      ],
      stock: 15000,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20 font-sans text-slate-900">
      
      {/* Header */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-6 border border-blue-500/30">
              <Building size={16} /> Spark Business
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              Enterprise Procurement. <br/>Simplified.
            </h1>
            <p className="text-xl text-slate-300 font-medium mb-8">
              Access wholesale pricing, request bulk quotes, and streamline your supply chain with our intelligent B2B platform.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all">
                Quick Order Form
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2">
                <FileText size={18} /> Tax Exemption
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/3">
            <div className="bg-white/10 border border-white/10 backdrop-blur-md p-6 rounded-2xl">
              <TrendingDown className="text-green-400 mb-3" size={28} />
              <h4 className="font-bold text-lg text-white mb-1">Volume Pricing</h4>
              <p className="text-xs text-slate-300">Save up to 45% on bulk wholesale orders.</p>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-md p-6 rounded-2xl">
              <FileText className="text-blue-400 mb-3" size={28} />
              <h4 className="font-bold text-lg text-white mb-1">Invoicing</h4>
              <p className="text-xs text-slate-300">Net 30/60/90 terms available for verified businesses.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2 flex flex-wrap gap-2 mb-10">
          <button onClick={() => setActiveTab('catalog')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'catalog' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            <PackageOpen size={18} /> Wholesale Catalog
          </button>
          <button onClick={() => setActiveTab('quotes')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'quotes' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Calculator size={18} /> My Quotes
          </button>
          <button onClick={() => setActiveTab('team')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'team' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Users size={18} /> Team Management
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'catalog' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">Bulk Order Catalog</h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search SKU or Name..." className="w-64 bg-white border border-slate-300 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-6">
              {catalog.map(item => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-64 h-48 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">{item.name}</h4>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">SKU: {item.sku}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">MSRP</p>
                        <p className="text-lg font-bold text-slate-500 line-through">${item.msrp}</p>
                      </div>
                    </div>

                    <div className="my-6">
                      <p className="text-sm font-bold text-slate-900 mb-3">Volume Pricing Tiers</p>
                      <div className="flex flex-wrap gap-4">
                        {item.tiers.map((tier, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex-1 min-w-[120px] text-center">
                            <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Qty: {tier.qty}</p>
                            <p className="text-2xl font-black text-blue-900">${tier.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                        <CheckCircle size={16} /> In Stock ({item.stock.toLocaleString()} units)
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-500 mb-1">Order Qty</label>
                          <input type="number" defaultValue={10} min={1} className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-blue-500" />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors mt-5">
                          Add to PO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Management Placeholder */}
        {activeTab === 'team' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <Users className="mx-auto text-slate-300 w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Team Procurement Hub</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Invite team members, set purchasing limits, and configure multi-level approval workflows for large orders.</p>
            <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800">
              Invite Team Member
            </button>
          </div>
        )}

        {/* Quotes Placeholder */}
        {activeTab === 'quotes' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <Calculator className="mx-auto text-slate-300 w-16 h-16 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Custom Quotes</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">You have no active quote requests. Request a custom quote for orders exceeding standard tier limits.</p>
            <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800">
              Request New Quote
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default WholesaleB2B;
