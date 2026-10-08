import React from 'react';
import { Link } from 'react-router-dom';
import { Store, HelpCircle, Gift, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#172337] pt-12 pb-6 mt-16 text-gray-300 text-sm font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-10 pb-10 border-b border-white/10">
          
          <div className="lg:col-span-1">
            <h4 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">SparkCart Stories</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Corporate Information</a></li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h4 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Payments</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Report Infringement</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Consumer Policy</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Terms Of Use</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Sitemap</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Grievance Redressal</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 border-r-0 lg:border-r lg:border-white/10 pr-4">
            <h4 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Social</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">YouTube</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 pl-0 lg:pl-4">
            <h4 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Mail Us:</h4>
            <div className="text-xs space-y-1 leading-relaxed">
              <p>SparkCart Internet Private Limited,</p>
              <p>Buildings Alyssa, Begonia &</p>
              <p>Clove Embassy Tech Village,</p>
              <p>Outer Ring Road, Devarabeesanahalli Village,</p>
              <p>Bengaluru, 560103,</p>
              <p>Karnataka, India</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-wider">Registered Office Address:</h4>
            <div className="text-xs space-y-1 leading-relaxed">
              <p>SparkCart Internet Private Limited,</p>
              <p>Buildings Alyssa, Begonia &</p>
              <p>Clove Embassy Tech Village,</p>
              <p>Outer Ring Road, Devarabeesanahalli Village,</p>
              <p>Bengaluru, 560103,</p>
              <p>Karnataka, India</p>
              <p>CIN : U51109KA2012PTC066107</p>
              <p>Telephone: <a href="tel:044-45614700" className="text-blue-400">044-45614700</a></p>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 text-sm font-semibold text-white">
          <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors">
            <Store className="text-yellow-400 w-4 h-4" /> Become a Seller
          </div>
          <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors">
            <Sparkles className="text-yellow-400 w-4 h-4" /> Advertise
          </div>
          <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors">
            <Gift className="text-yellow-400 w-4 h-4" /> Gift Cards
          </div>
          <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition-colors">
            <HelpCircle className="text-yellow-400 w-4 h-4" /> Help Center
          </div>
          <div className="text-gray-400 font-normal">
            &copy; 2007-{new Date().getFullYear()} SparkCart.com
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-6 text-gray-400" />
            <ShieldCheck className="w-8 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
