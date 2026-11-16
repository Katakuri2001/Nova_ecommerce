import React from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Grid3X3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useCartStore } from '../../stores';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="sticky top-0 z-40 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-nova-500 to-nova-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">NOVA</span>
          </Link>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={18} />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                className="w-full bg-surface-900 border border-surface-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-surface-800 transition-colors">
              <Heart size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                {items.filter(i => i.productVariantId).length}
              </span>
            </Link>
            
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-surface-800 transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-nova-600 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-surface-300 hidden sm:inline">{user.first_name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
                <Link to="/register"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}
            
            <button className="md:hidden p-2 rounded-lg hover:bg-surface-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-surface-900 border border-surface-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500"
              />
            </div>
            <Link to="/cart" className="block px-4 py-2 rounded-lg hover:bg-surface-800 text-sm">Cart ({totalItems})</Link>
            <Link to="/wishlist" className="block px-4 py-2 rounded-lg hover:bg-surface-800 text-sm">Wishlist</Link>
            {!user && (
              <>
                <Link to="/login" className="block px-4 py-2 rounded-lg hover:bg-surface-800 text-sm">Sign In</Link>
                <Link to="/register" className="block px-4 py-2 rounded-lg hover:bg-surface-800 text-sm">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
