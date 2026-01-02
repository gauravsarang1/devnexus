
import React from 'react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 pt-20 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">SkillSwap</span>
            </div>
            <p className="text-slate-500 mb-8 max-w-xs">
              Empowering the next generation of Indian creators and engineers through peer-to-peer skill exchange.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Safety</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2024 SkillSwap India. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-900">Support</a>
            <a href="#" className="hover:text-slate-900">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
