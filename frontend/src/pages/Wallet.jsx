import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, History, Gift, Sparkles, ChevronRight, AlertCircle, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Wallet = ({ userInfo }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(12450.75); // Mock initial balance
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');
  const [showTopupModal, setShowTopupModal] = useState(false);
  
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] pt-24 pb-20 flex items-center justify-center font-sans">
        <div className="text-center bg-white/5 p-12 rounded-3xl border border-white/10 max-w-lg">
          <WalletIcon size={64} className="mx-auto text-indigo-500 mb-6" />
          <h2 className="text-3xl font-black text-white mb-4">Spark Wallet</h2>
          <p className="text-gray-400 mb-8 text-lg">Please sign in to access your digital wallet, manage funds, and view transaction history.</p>
          <button 
            onClick={() => navigate('/login?redirect=/wallet')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const transactions = [
    { id: 'tx-1', type: 'debit', title: 'Placed Bid - Vintage Rolex', amount: 42500, date: 'Today, 10:42 AM', status: 'pending' },
    { id: 'tx-2', type: 'credit', title: 'Refund - Outbid on Jordan 1', amount: 11200, date: 'Yesterday, 08:15 PM', status: 'completed' },
    { id: 'tx-3', type: 'debit', title: 'Mystery Box Purchase (Elite)', amount: 299, date: 'Oct 5, 2026', status: 'completed' },
    { id: 'tx-4', type: 'credit', title: 'Top-Up via Apple Pay', amount: 5000, date: 'Oct 1, 2026', status: 'completed' },
    { id: 'tx-5', type: 'credit', title: 'Referral Bonus', amount: 50, date: 'Sep 28, 2026', status: 'completed' },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopup = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    
    // Mock processing
    setTimeout(() => {
      setBalance(prev => prev + parseFloat(amount));
      setShowTopupModal(false);
      setAmount('');
      alert(`Successfully added $${parseFloat(amount).toLocaleString()} to your wallet!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] pt-24 pb-20 font-sans text-white">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Balance Card */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/10 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -mr-48 -mt-48 pointer-events-none"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/20 mb-4">
                    <WalletIcon size={14} /> Spark Digital Wallet
                  </div>
                  <h3 className="text-gray-300 font-medium mb-1">Available Balance</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tighter">
                      ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xl text-gray-400 font-bold">USD</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-2 ml-auto">
                    <ShieldCheck className="text-green-400" />
                  </div>
                  <span className="text-xs text-gray-300 font-bold uppercase">Secured</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowTopupModal(true)}
                  className="flex-1 bg-white hover:bg-gray-100 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowDownLeft size={20} /> Add Funds
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                  <ArrowUpRight size={20} /> Withdraw
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Actions & Info */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="text-indigo-500/30 w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6">Wallet Details</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Wallet ID</p>
                  <div className="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-white/5">
                    <span className="font-mono text-sm tracking-widest text-gray-300">SPK-8942-XXXX-1104</span>
                    <button onClick={() => handleCopy('SPK-8942-XXXX-1104')} className="text-gray-400 hover:text-white transition-colors">
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Linked Cards</p>
                  <div className="flex items-center gap-4 bg-black/50 p-3 rounded-lg border border-white/5">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                      <span className="text-[10px] font-black italic">VISA</span>
                    </div>
                    <span className="text-sm font-bold flex-1">•••• 4242</span>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-8">
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3">
                <Gift className="text-indigo-400 shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-indigo-300 mb-1">Earn 2% Cashback</h4>
                  <p className="text-xs text-indigo-200/70 leading-relaxed">Top up with crypto or bank transfer to earn unlimited 2% cashback on SparkCart purchases.</p>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 w-full max-w-md mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <History size={16} /> Activity
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'analytics' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Sparkles size={16} /> Insights
          </button>
        </div>

        {/* Activity List */}
        {activeTab === 'overview' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent Transactions</h3>
              <button className="text-sm text-indigo-400 font-bold hover:text-indigo-300">View All</button>
            </div>
            <div className="divide-y divide-white/5">
              {transactions.map(tx => (
                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-300'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1">{tx.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black text-lg mb-1 tracking-tight ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </div>
                    {tx.status === 'pending' ? (
                      <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Pending</span>
                    ) : (
                      <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab Placeholder */}
        {activeTab === 'analytics' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-indigo-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Spending Insights</h3>
            <p className="text-gray-400 max-w-md mx-auto">AI-powered analysis of your spending habits across categories will appear here after your first month of activity.</p>
          </div>
        )}

      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopupModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-xl font-bold">Add Funds</h3>
                <button onClick={() => setShowTopupModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleTopup} className="p-6">
                
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Amount (USD)</label>
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-500">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-3xl font-black focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[50, 100, 500].map(val => (
                    <button 
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 font-bold text-sm transition-colors"
                    >
                      +${val}
                    </button>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
                  <CreditCard className="text-blue-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-bold text-blue-300">Funding Source</p>
                    <p className="text-xs text-blue-200/70 mt-1">Funds will be pulled from your linked Visa ending in 4242.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!amount || isNaN(amount) || parseFloat(amount) <= 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black py-4 rounded-xl transition-all shadow-lg"
                >
                  Confirm & Add Funds
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Wallet;
