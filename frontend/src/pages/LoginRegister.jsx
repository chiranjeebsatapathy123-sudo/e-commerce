import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { LogIn, UserPlus, ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginRegister = ({ userInfo, setUserInfo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        const { data } = await api.post('/auth/register', { name, email, password });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row relative z-10 p-4 md:p-8 mt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Side: Form Container */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl md:rounded-l-3xl md:rounded-r-none shadow-2xl relative z-20">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"
            >
              <ShieldCheck className="text-white w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              {isLogin ? 'Enter your credentials to access your account.' : 'Join us to get started with our premium features.'}
            </p>
          </div>

          <div className="flex bg-black/30 rounded-full p-1 mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
                required
              />
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
          
          <div className="mt-8 text-center">
            {isLogin ? (
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-indigo-400 font-semibold hover:text-white transition-colors hover:underline">
                  Sign up for free
                </button>
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-indigo-400 font-semibold hover:text-white transition-colors hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Marketing Visuals */}
        <div className="hidden md:flex w-full md:w-1/2 p-12 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md border border-white/5 border-l-0 rounded-r-3xl flex-col justify-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"></div>
          
          {/* Animated Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-[80px] opacity-30 animate-spin-slow"></div>

          <div className="relative z-10 text-center space-y-6">
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              {isLogin ? "Welcome Back to SparkCart" : "Join the Future of Commerce"}
            </h3>
            <p className="text-lg text-indigo-200/80 leading-relaxed">
              {isLogin 
                ? "Dive back into your personalized shopping experience. Discover curated deals and pick up right where you left off." 
                : "Create an account to unlock exclusive AI-powered recommendations, lightning-fast checkout, and premium rewards."}
            </p>
            
            <div className="pt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transform hover:-translate-y-1 transition-transform">
                <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold text-sm">Secure Checkout</h4>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transform hover:-translate-y-1 transition-transform">
                <UserPlus className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold text-sm">Personalized AI</h4>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegister;
