import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Gift, CheckCircle, Zap, ShieldCheck, ChevronRight, Lock, Calendar, Target, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RewardsHub = ({ userInfo }) => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(4850);
  const [level, setLevel] = useState('Gold Tier');
  const [showSpin, setShowSpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-[#0f0c29] pt-24 flex items-center justify-center font-sans text-white">
        <div className="bg-white/10 p-12 rounded-3xl backdrop-blur-md border border-white/20 text-center max-w-lg shadow-2xl">
          <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
          <h2 className="text-3xl font-black mb-4">Spark Rewards Hub</h2>
          <p className="text-gray-300 mb-8">Sign in to access your rewards, complete daily challenges, and earn exclusive perks.</p>
          <button 
            onClick={() => navigate('/login?redirect=/rewards')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const dailyTasks = [
    { id: 1, title: 'Daily Check-in', reward: 50, completed: true },
    { id: 2, title: 'Browse 5 Products', reward: 20, completed: false },
    { id: 3, title: 'Share a Product', reward: 100, completed: false },
    { id: 4, title: 'Watch a Live Stream for 5 mins', reward: 150, completed: false },
  ];

  const milestones = [
    { name: 'Bronze', threshold: 0, current: true },
    { name: 'Silver', threshold: 1000, current: true },
    { name: 'Gold', threshold: 5000, current: false },
    { name: 'Platinum', threshold: 10000, current: false },
    { name: 'Diamond', threshold: 25000, current: false },
  ];

  const handleSpinWheel = () => {
    if (coins < 100) {
      alert("Not enough coins! You need 100 coins to spin.");
      return;
    }
    
    setCoins(prev => prev - 100);
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate wheel spinning
    setTimeout(() => {
      setIsSpinning(false);
      const random = Math.random();
      let prize = "Try Again";
      if (random < 0.1) prize = "500 Coins";
      else if (random < 0.3) prize = "$5 Off Coupon";
      else if (random < 0.6) prize = "Free Shipping";
      else if (random < 0.8) prize = "200 Coins";
      
      setSpinResult(prize);
      if (prize.includes("Coins")) {
        const amount = parseInt(prize.split(' ')[0]);
        setCoins(prev => prev + amount);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] pt-20 pb-20 font-sans text-white">
      {/* Dynamic BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-[#0a0f1a] to-purple-900/20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        
        {/* User Stats Card */}
        <div className="relative bg-gradient-to-br from-yellow-600/90 to-orange-600/90 rounded-3xl p-8 shadow-[0_10px_40px_rgba(234,179,8,0.2)] mb-12 border border-yellow-500/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-[80px] -mr-48 -mt-48 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center border-2 border-white/40 shadow-inner">
                <Trophy size={40} className="text-yellow-100" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-1">{userInfo.name}'s Rewards</h1>
                <div className="inline-flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full text-sm font-bold text-yellow-100 uppercase tracking-widest border border-white/10">
                  <Award size={14} /> {level}
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 items-center bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <p className="text-sm font-bold text-yellow-100/70 uppercase tracking-widest mb-1">Spark Coins</p>
                <div className="flex items-center gap-2 text-4xl font-black text-white">
                  <Star className="text-yellow-300" fill="currentColor" /> {coins.toLocaleString()}
                </div>
              </div>
              <div className="w-px h-16 bg-white/20"></div>
              <div className="text-center">
                <p className="text-sm font-bold text-yellow-100/70 uppercase tracking-widest mb-1">To Next Tier</p>
                <div className="text-2xl font-bold text-white">150 XP</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 mt-10">
            <div className="flex justify-between text-xs font-bold text-yellow-100/70 mb-2 uppercase tracking-wider">
              <span>Bronze</span>
              <span>Silver</span>
              <span className="text-white">Gold</span>
              <span>Platinum</span>
              <span>Diamond</span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/10">
              <div className="h-full bg-gradient-to-r from-yellow-200 to-white w-[55%] relative rounded-full">
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Daily Challenges */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Target className="text-indigo-500/20 w-32 h-32" />
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <h3 className="text-2xl font-bold">Daily Quests</h3>
              </div>
              
              <div className="space-y-4 relative z-10">
                {dailyTasks.map(task => (
                  <div key={task.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${task.completed ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-600 text-gray-500'}`}>
                        {task.completed ? <CheckCircle size={20} /> : <div className="w-3 h-3 rounded-full bg-gray-600"></div>}
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{task.title}</h4>
                        <p className="text-sm text-yellow-400 font-bold flex items-center gap-1">
                          <Star size={12} fill="currentColor"/> +{task.reward} Coins
                        </p>
                      </div>
                    </div>
                    <button 
                      disabled={task.completed}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${task.completed ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]'}`}
                    >
                      {task.completed ? 'Claimed' : 'Go'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privileges */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldCheck className="text-green-400" /> Tier Privileges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/10 border border-green-500/20 p-5 rounded-2xl flex items-start gap-4">
                  <Zap className="text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Free Expedited Shipping</h4>
                    <p className="text-sm text-gray-400">Enjoy 2-day free shipping on all orders over $35.</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/10 border border-purple-500/20 p-5 rounded-2xl flex items-start gap-4">
                  <Gift className="text-purple-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Birthday Surprise</h4>
                    <p className="text-sm text-gray-400">Receive a special Mystery Box during your birthday month.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Wheel of Fortune */}
          <div className="bg-gradient-to-b from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/30 mb-6">
              Lucky Draw
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Spin the Wheel</h3>
            <p className="text-sm text-gray-400 mb-8">Try your luck! Costs 100 coins per spin.</p>
            
            <div className="relative w-64 h-64 mb-8">
              {/* The Wheel */}
              <motion.div 
                animate={{ rotate: isSpinning ? 1800 : 0 }}
                transition={{ duration: 3, ease: "circOut" }}
                className="w-full h-full rounded-full border-4 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.3)] bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500')] bg-cover bg-center relative overflow-hidden flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles className="text-indigo-600" />
                </div>
              </motion.div>
              
              {/* Pointer */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full border-4 border-[#0a0f1a] z-20 flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500 absolute -bottom-3"></div>
              </div>
            </div>

            <AnimatePresence>
              {spinResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-xl font-bold mb-6 text-lg"
                >
                  🎉 You won: {spinResult}!
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleSpinWheel}
              disabled={isSpinning || coins < 100}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black py-4 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-auto"
            >
              {isSpinning ? 'Spinning...' : 'Spin Now (100 Coins)'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RewardsHub;
