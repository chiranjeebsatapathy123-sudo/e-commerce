import React from 'react';
import { Link } from 'react-router-dom';
import { Store, HelpCircle, Gift, CreditCard, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#050505] pt-24 pb-12 mt-16 text-gray-600 dark:text-gray-400 text-sm font-sans border-t border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-indigo-100 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        
        {/* Brand Newsletter area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 pb-20 border-b border-gray-200 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 dark:bg-white/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">SparkCart</span>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">The world's most advanced shopping experience.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
            <input type="email" placeholder="Enter your email" className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-4 rounded-xl focus:outline-none focus:border-indigo-500/50 w-full md:w-80 text-gray-900 dark:text-white font-medium" />
            <button className="bg-gray-900 dark:bg-white text-white dark:text-black font-black px-8 py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              Subscribe <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 font-medium">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-xs uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 font-medium">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-xs uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 font-medium">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-xs uppercase tracking-widest">Headquarters</h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed font-medium">
              <p>SparkCart Global Inc.</p>
              <p>One Infinite Commerce Loop</p>
              <p>Silicon Valley, CA 94025</p>
              <p>United States</p>
              <p className="mt-4"><a href="mailto:hello@sparkcart.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">hello@sparkcart.com</a></p>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-200 dark:border-white/5 text-xs font-bold uppercase tracking-widest">
          <div className="flex flex-wrap justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors">
              <Store size={14} /> Sell on SparkCart
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors">
              <Gift size={14} /> Gift Cards
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors">
              <HelpCircle size={14} /> Support
            </div>
          </div>
          
          <div className="text-gray-500 dark:text-gray-600">
            &copy; {new Date().getFullYear()} SparkCart Global. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
