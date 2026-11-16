import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export default function Account() {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<{ products: Product[] }>('/products'),
  });

  const products = data?.products || [];

  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="panel p-5">
          <p className="eyebrow px-3">My NOVA</p>
          <nav className="mt-5 space-y-1">
            {['Overview', 'My orders', 'Order tracking', 'Wishlist', 'Saved addresses', 'Notifications', 'Account settings'].map(
              (item, index) => (
                <button key={item} className={`sidebar-link ${index === 0 ? 'is-active' : ''}`}>
                  {item}
                  {index === 1 && <span>3</span>}
                </button>
              )
            )}
          </nav>
        </aside>
        <div>
          <p className="eyebrow">Good evening, Mika</p>
          <h1 className="mt-3 text-4xl font-light">Your world, in one place.</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['03', 'Orders'],
              ['08', 'Saved objects'],
              ['12', 'Reviews'],
            ].map(([value, label]) => (
              <div className="panel p-6" key={label}>
                <p className="text-3xl font-light">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-[#718096]">{label}</p>
              </div>
            ))}
          </div>
          <div className="panel mt-5 p-6">
            <div className="flex justify-between">
              <div>
                <p className="eyebrow">In transit</p>
                <h2 className="mt-2 text-xl">Order NV-02491</h2>
              </div>
              <span className="status-badge">Arrives tomorrow</span>
            </div>
            <div className="mt-8 grid grid-cols-4">
              {['Confirmed', 'Prepared', 'In transit', 'Delivered'].map((item, index) => (
                <div key={item} className="relative text-xs">
                  <span className={`mb-3 block h-2 w-2 rounded-full ${index < 3 ? 'bg-[#739fff]' : 'bg-white/15'}`} />
                  <p className={index < 3 ? 'text-white' : 'text-[#718096]'}>{item}</p>
                  {index < 3 && (
                    <div className="absolute left-2 top-[3px] h-px w-[calc(100%-8px)] bg-[#4d8cff]/50" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-white/[0.08] pt-5">
              <img src={products[4]?.image || ''} className="h-16 w-14 rounded-lg object-cover" alt="" />
              <div>
                <p className="text-sm">{products[4]?.name}</p>
                <p className="mt-1 text-xs text-[#718096]">Graphite · Standard</p>
              </div>
              <button className="ml-auto text-sm text-[#91acff]">Track order</button>
            </div>
          </div>
          <h2 className="mt-10 text-xl font-light">Recently viewed</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}