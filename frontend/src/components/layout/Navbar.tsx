import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Bell, ChevronDown } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useCartStore } from '../../stores';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080b14]/82 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center gap-7 px-5 lg:px-10">
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="NOVA home">
            <span className="nova-mark">
              <span />
            </span>
            <span className="text-[13px] font-semibold tracking-[0.23em] text-white">
              NOVA <b className="font-medium text-white/45">COMMERCE</b>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-6 text-[13px] text-[#a5b3c8] lg:flex">
            <NavLink className="nav-link" to="/shop">New & noteworthy</NavLink>
            <NavLink className="nav-link" to="/products?category=electronics">Technology</NavLink>
            <NavLink className="nav-link" to="/products?category=fashion">Fashion</NavLink>
            <NavLink className="nav-link" to="/products?category=home">Living</NavLink>
          </nav>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="search-trigger ml-auto hidden min-w-[220px] max-w-[340px] flex-1 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-left text-sm text-[#718096] md:flex"
          >
            <Search size={16} />
            <span className="flex-1">Search the extraordinary</span>
            <kbd>⌘ K</kbd>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="icon-btn md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={19} />
            </button>
            <button className="icon-btn hidden sm:grid" aria-label="Wishlist">
              <Heart size={19} />
            </button>
            <button className="icon-btn hidden sm:grid" aria-label="Notifications">
              <Bell size={19} />
              <span className="status-dot" />
            </button>
            {user ? (
              <button className="icon-btn hidden sm:grid" aria-label="Account">
                <User size={19} />
              </button>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
            )}
            <button className="icon-btn relative" onClick={() => {}} aria-label="Cart">
              <ShoppingCart size={19} />
              {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
              )}
            </button>
            <button className="icon-btn lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.06] bg-[#080b14] px-5 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              <Link to="/shop" className="text-sm text-[#a5b3c8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>New & noteworthy</Link>
              <Link to="/products" className="text-sm text-[#a5b3c8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Technology</Link>
              <Link to="/products" className="text-sm text-[#a5b3c8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Fashion</Link>
              <Link to="/products" className="text-sm text-[#a5b3c8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Living</Link>
              {!user && (
                <>
                  <Link to="/login" className="text-sm text-[#a5b3c8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="text-sm text-[#a5b3c8] hover:text-white" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#080b14]/96 backdrop-blur-2xl">
          <div className="mx-auto max-w-4xl px-5 py-6 md:py-12">
            <div className="flex items-center gap-4">
              <Link to="/" className="group flex shrink-0 items-center gap-2.5" onClick={() => setSearchOpen(false)}>
                <span className="nova-mark"><span /></span>
                <span className="text-[13px] font-semibold tracking-[0.23em] text-white">NOVA <b className="font-medium text-white/45">COMMERCE</b></span>
              </Link>
              <button className="icon-btn ml-auto" onClick={() => setSearchOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mt-12 flex items-center gap-4 border-b border-white/15 pb-4">
              <Search className="text-[#718096]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-2xl font-light outline-none placeholder:text-white/20 md:text-4xl"
                placeholder="What are you looking for?"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}