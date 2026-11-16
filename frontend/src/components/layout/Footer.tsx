import React from 'react';
import { Github, Twitter, Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-nova-500 to-nova-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-xl">NOVA Commerce</span>
            </div>
            <p className="text-sm text-surface-500">Premium multi-vendor marketplace for modern shopping.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Shop</h4>
            <ul className="space-y-2 text-sm text-surface-500">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Flash Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Customer Service</h4>
            <ul className="space-y-2 text-sm text-surface-500">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Stay Updated</h4>
            <p className="text-sm text-surface-500 mb-3">Get the latest deals and new products.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500" />
              <button className="bg-nova-600 hover:bg-nova-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">© 2026 NOVA Commerce. All rights reserved.</p>
          <div className="flex gap-3">
            <a href="#" className="text-surface-500 hover:text-white transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-surface-500 hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="text-surface-500 hover:text-white transition-colors"><Facebook size={18} /></a>
            <a href="#" className="text-surface-500 hover:text-white transition-colors"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
