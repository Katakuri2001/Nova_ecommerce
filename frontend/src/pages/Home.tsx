import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard, { ProductGrid } from '../components/products/ProductCard';
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
  review_count?: number;
  reviews?: number;
  image: string;
  seller_name?: string;
  brand?: string;
  in_stock?: boolean;
  badge?: string;
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<{ products: Product[] }>('/products'),
  });

  const products: Product[] = data?.products || [];

  const categories = [
    { name: 'Technology', image: products[0]?.image || '', count: '126 pieces' },
    { name: 'Modern carry', image: products[1]?.image || '', count: '84 pieces' },
    { name: 'Future form', image: products[2]?.image || '', count: '72 pieces' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-orb" />
        <div className="relative z-10 mx-auto grid min-h-[740px] max-w-[1480px] items-center gap-12 px-5 py-16 md:min-h-[780px] lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow mb-6 text-[#94adff]">Edition 06 · Objects with intention</p>
            <h1 className="display-title">
              Designed for
              <br />
              <span className="text-gradient">what's next.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#a5b3c8] md:text-lg">
              Discover a new standard of everyday objects—where purposeful design, exceptional
              craft, and tomorrow's technology converge.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/products">
                Explore the edit <ArrowRight size={16} />
              </Link>
              <a className="btn-secondary" href="#collections">
                View collections
              </a>
            </div>
            <div className="mt-12 flex items-center gap-7 border-t border-white/[0.08] pt-6">
              <div>
                <p className="text-xl font-light">240+</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[#718096]">Designers</p>
              </div>
              <div className="h-9 w-px bg-white/10" />
              <div>
                <p className="text-xl font-light">36</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[#718096]">Countries</p>
              </div>
              <div className="h-9 w-px bg-white/10" />
              <div>
                <p className="text-xl font-light">4.9</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[#718096]">Community</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-visual"
          >
            <img src={products[0]?.image || 'https://picsum.photos/800/800'} alt="Featured product" />
            <div className="hero-card">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Sparkles size={14} />
              </span>
              <p className="text-xs uppercase tracking-widest text-[#a5b3c8]">Featured artifact</p>
              <p className="mt-1 font-medium">{products[0]?.name || 'Featured'}</p>
              <p className="mt-3 text-xs text-[#718096]">Precision, without compromise.</p>
            </div>
            <span className="hero-index">01 / 06</span>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="collections" className="section-shell py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by world</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight md:text-5xl">Find your next obsession.</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-2 text-sm text-[#a5b3c8] hover:text-white sm:flex">
            All categories <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="text-xl font-medium">{category.name}</p>
                  <p className="mt-1 text-xs text-white/55">{category.count}</p>
                </div>
                <span className="grid h-10 w-10 place-content-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md">
                  <ArrowRight size={16} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-shell pb-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The current</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight md:text-5xl">Trending, exceptionally.</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-2 text-sm text-[#a5b3c8] hover:text-white sm:flex">
            Explore all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {isLoading ? (
            <ProductGrid products={[]} loading />
          ) : (
            products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="section-shell pb-24">
        <div className="editorial-banner">
          <img src={products[3]?.image || 'https://picsum.photos/800/600'} alt="NOVA fashion edit" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b14] via-[#080b14]/70 to-transparent" />
          <div className="relative z-10 max-w-lg">
            <p className="eyebrow text-[#b8c7ff]">The after-dark edit</p>
            <h2 className="mt-5 text-4xl font-light leading-tight md:text-6xl">
              New silhouettes.
              <br />
              Zero compromise.
            </h2>
            <p className="mt-5 text-sm leading-6 text-[#a5b3c8]">
              Progressive materials and sculptural forms from independent design studios.
            </p>
            <Link to="/products" className="btn-primary mt-8">
              Discover the collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-shell pb-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Freshly arrived</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight md:text-5xl">Objects of desire.</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-2 text-sm text-[#a5b3c8] hover:text-white sm:flex">
            New arrivals <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {isLoading ? (
            <ProductGrid products={[]} loading />
          ) : (
            products.slice(4, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y border-white/[0.07] bg-[#0b0f1a]">
        <div className="section-shell grid gap-8 py-20 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="eyebrow">NOVA Dispatch</p>
            <h2 className="mt-4 text-3xl font-light md:text-5xl">A better inbox.</h2>
          </div>
          <div>
            <p className="mb-5 max-w-xl text-sm leading-6 text-[#718096]">
              New drops, studio stories, and private editions. Thoughtfully sent, never crowded.
            </p>
            <div className="flex border-b border-white/20 pb-3">
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#4f5b70]"
                placeholder="Email address"
              />
              <button aria-label="Subscribe" className="text-[#a5b3c8] hover:text-white">
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}