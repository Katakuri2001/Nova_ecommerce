import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import ProductCard, { ProductGrid } from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  compare_at_price?: number;
  oldPrice?: number;
  rating: number;
  review_count?: number;
  reviews?: number;
  image: string;
  seller_name?: string;
  brand?: string;
  category?: string;
  category_name?: string;
  in_stock?: boolean;
  badge?: string;
}

interface ProductListingProps {
  products?: Product[];
  loading?: boolean;
}

export default function ProductListing({ products = [], loading = false }: ProductListingProps) {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'All';
  // Normalize URL category to match filter labels
  const categoryMap: Record<string, string> = {
    electronics: 'Electronics',
    fashion: 'Fashion',
    home: 'Home & Living',
    accessories: 'Accessories',
    all: 'All',
  };
  const normalizedCategory = categoryMap[urlCategory.toLowerCase()] || urlCategory;
  const [activeCategory, setActiveCategory] = React.useState(normalizedCategory);
  const [sort, setSort] = React.useState('Featured');
  const [filterOpen, setFilterOpen] = React.useState(false);

  React.useEffect(() => {
    setActiveCategory(normalizedCategory);
  }, [normalizedCategory]);

  const visible = React.useMemo(() => {
    const filtered =
      activeCategory === 'All'
        ? products
        : products.filter((p) => {
            const cat = (p.category || p.category_name || '').toLowerCase();
            return cat.includes(activeCategory.toLowerCase());
          });
    return [...filtered].sort((a, b) =>
      sort === 'Price low' ? a.price - b.price : sort === 'Rating' ? b.rating - a.rating : 0
    );
  }, [activeCategory, sort, products]);

  return (
    <>
      <div className="section-shell py-10 md:py-16">
      <div className="text-xs text-[#718096]">
        Home / Collections / <span className="text-[#a5b3c8]">All objects</span>
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">NOVA Collection</p>
          <h1 className="mt-3 text-4xl font-light md:text-6xl">Considered objects.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#718096]">
            A living collection of technology, fashion, and design chosen for how it looks, works,
            and lasts.
          </p>
        </div>
        <p className="text-sm text-[#718096]">{visible.length} pieces</p>
      </div>

      <div className="mt-10 flex items-center justify-between border-y border-white/[0.07] py-4">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal size={16} /> Filters
          {activeCategory !== 'All' && <span className="filter-count">1</span>}
        </button>
        <label className="flex items-center gap-3 text-sm text-[#718096]">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select-dark"
          >
            <option>Featured</option>
            <option>Price low</option>
            <option>Rating</option>
          </select>
        </label>
      </div>

      <div className="mt-8 flex gap-8">
        {filterOpen && (
          <aside className="hidden w-56 shrink-0 md:block">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest">Category</p>
            <div className="space-y-3">
              {['All', 'Electronics', 'Fashion', 'Accessories', 'Home & Living'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveCategory(item)}
                  className={`flex w-full justify-between text-sm ${
                    activeCategory === item ? 'text-white' : 'text-[#718096] hover:text-white'
                  }`}
                >
                  {item}
                  {activeCategory === item && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4d8cff]" />
                  )}
                </button>
              ))}
            </div>
            {['Price', 'Brand', 'Rating', 'Availability'].map((label) => (
              <button
                key={label}
                className="mt-7 flex w-full items-center justify-between border-t border-white/[0.07] pt-5 text-sm"
              >
                {label} <Plus size={14} />
              </button>
            ))}
          </aside>
        )}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
          {loading ? (
            <ProductGrid products={[]} loading />
          ) : (
            visible.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>
      </div>
      {activeCategory !== 'All' && (
        <button className="filter-chip mt-8 md:hidden" onClick={() => setActiveCategory('All')}>
          {activeCategory} <X size={13} />
        </button>
      )}
    </div>
    <Footer />
    </>
  );
}