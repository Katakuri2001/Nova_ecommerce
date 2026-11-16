import React, { useState, useMemo } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Bell } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useCartStore } from '../../stores';
import Button from '../ui/Button';

// Sample products for search (would come from API in production)
const searchProducts = [
  { id: 1, name: 'Aperture X1 Mirrorless', brand: 'Lumina', category: 'Electronics', price: 2890000, image: 'https://images.unsplash.com/photo-1630583206477-f232a811f672?auto=format&fit=crop&w=1200&q=88' },
  { id: 2, name: 'Arc Weekender No. 02', brand: 'Atelier Noire', category: 'Accessories', price: 485000, image: 'https://images.unsplash.com/photo-1590901839295-591369527402?auto=format&fit=crop&w=1200&q=88' },
  { id: 3, name: 'Halo Structure Dress', brand: 'Maison K', category: 'Fashion', price: 318000, image: 'https://images.unsplash.com/photo-1711534718304-87105fc69fd8?auto=format&fit=crop&w=1200&q=88' },
  { id: 4, name: 'Flux Chrome Jacket', brand: 'NEON 44', category: 'Fashion', price: 425000, image: 'https://images.unsplash.com/photo-1633815475307-884ad652b80b?auto=format&fit=crop&w=1200&q=88' },
  { id: 5, name: 'Meridian Automatic', brand: 'Vesper', category: 'Accessories', price: 760000, image: 'https://images.unsplash.com/photo-1780337092500-f59e1366e629?auto=format&fit=crop&w=1200&q=88' },
  { id: 6, name: 'Auralis Reference Player', brand: 'Kanso', category: 'Electronics', price: 535000, image: 'https://images.unsplash.com/photo-1775288260757-4ff6ceca81c3?auto=format&fit=crop&w=1200&q=88' },
  { id: 7, name: 'Orbit Glass Sculpture', brand: 'Form Studio', category: 'Home & Living', price: 245000, image: 'https://images.unsplash.com/photo-1656695537545-cfcb911d647a?auto=format&fit=crop&w=1200&q=88' },
  { id: 8, name: 'Eon Titanium Eyewear', brand: 'Obi', category: 'Accessories', price: 195000, image: 'https://images.unsplash.com/photo-1648005094665-c2b3d942f35f?auto=format&fit=crop&w=1200&q=88' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
            <div className="mt-8 grid gap-10 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="eyebrow">Popular searches</p>
                <div className="mt-4 space-y-3 text-sm text-[#a5b3c8]">
                  {['Minimal watches', 'Travel essentials', 'New technology', 'Design objects'].map(
                    (item, index) => (
                      <button
                        key={item}
                        onClick={() => setSearchQuery(item.split(' ')[1] || item)}
                        className="block hover:text-white"
                      >
                        <span className="mr-3 text-white/25">0{index + 1}</span> {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <p className="eyebrow">
                  {searchQuery ? `${searchResults.length} results` : 'Suggested for you'}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {(searchQuery ? searchResults : searchProducts.slice(0, 4)).slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      onClick={() => setSearchOpen(false)}
                      to={`/products/${product.id}`}
                      className="group flex gap-3 rounded-xl border border-white/[0.06] p-2 hover:bg-white/[0.04]"
                    >
                      <img
                        className="h-16 w-14 rounded-lg object-cover"
                        src={product.image}
                        alt=""
                      />
                      <div className="hidden min-w-0 py-1 sm:block">
                        <p className="truncate text-sm">{product.name}</p>
                        <p className="mt-2 text-xs text-[#718096]">{product.price.toLocaleString()} MMK</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {searchQuery && searchResults.length === 0 && (
                  <p className="mt-4 text-sm text-[#718096]">No results found for "{searchQuery}"</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}