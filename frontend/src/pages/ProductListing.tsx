import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import ProductCard, { ProductGrid } from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  rating: number;
  review_count: number;
  image: string;
  seller_name: string;
  in_stock: boolean;
}

interface ProductListingProps {
  products?: Product[];
  loading?: boolean;
}

export default function ProductListing({ products = [], loading = false }: ProductListingProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">All Products</h1>
        <p className="text-surface-400">Discover the latest products from top sellers</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={18} />
          <input type="text" placeholder="Search products..." className="w-full bg-surface-900 border border-surface-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={18} /> Filters
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
          <Card className="sticky top-20">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-surface-300 mb-2">Category</h4>
                {['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Food'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" className="rounded border-surface-600" onChange={() => {}} />
                    <span className="text-sm text-surface-400">{cat}</span>
                  </label>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium text-surface-300 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {['Under 10,000', '10,000 - 50,000', '50,000 - 100,000', '100,000+'].map((range) => (
                    <label key={range} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" className="rounded border-surface-600" onChange={() => {}} />
                      <span className="text-sm text-surface-400">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-surface-300 mb-2">Rating</h4>
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" className="rounded border-surface-600" onChange={() => {}} />
                    <span className="text-sm text-surface-400">& Up</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </aside>
        
        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-surface-400">{products.length} products</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-nova-600/20 text-nova-400"><Grid3X3 size={18} /></button>
              <button className="p-2 rounded-lg hover:bg-surface-800 text-surface-500"><List size={18} /></button>
            </div>
          </div>
          
          {loading ? (
            <ProductGrid products={[]} loading />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
