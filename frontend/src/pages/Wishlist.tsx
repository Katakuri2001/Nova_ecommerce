import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  compare_at_price?: number;
  oldPrice?: number;
  rating: number;
  image: string;
  brand?: string;
  seller_name?: string;
  in_stock?: boolean;
  badge?: string;
}

export default function Wishlist() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<{ products: Product[] }>('/products'),
  });

  const products = data?.products || [];

  return (
    <div className="section-shell py-10 md:py-16">
      <div className="mb-7 text-xs text-[#718096]">
        <Link to="/account" className="hover:text-white">Account</Link> / <span className="text-[#a5b3c8]">Wishlist</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Saved objects</p>
          <h1 className="mt-3 text-4xl font-light md:text-6xl">Your wishlist.</h1>
          <p className="mt-4 text-sm text-[#718096]">{products.length} curated items</p>
        </div>
        <Link to="/products" className="btn-secondary !py-2.5">
          Continue shopping <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-xl bg-[#111724]" />
              <div className="mt-4 h-3 w-3/4 rounded bg-[#111724]" />
              <div className="mt-2 h-3 w-1/2 rounded bg-[#111724]" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="grid min-h-[50vh] place-content-center text-center">
          <Heart className="mx-auto mb-4 text-[#718096]" size={40} />
          <h2 className="text-2xl font-light mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-[#718096] mb-8">Save items you love for later.</p>
          <Link to="/products">
            <Button>Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}