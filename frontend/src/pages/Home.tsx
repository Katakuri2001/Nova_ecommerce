import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { ProductGrid } from '../components/products/ProductCard';
import { Star, TrendingUp, ShoppingBag, Zap } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

interface Product {
  id: string; name: string; slug: string; price: number; compare_at_price?: number;
  rating: number; review_count: number; image: string; seller_name: string; in_stock: boolean;
}

export default function Home() {
  const [products] = React.useState<Product[]>([]);
  const [loading] = React.useState(true);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nova-950 via-surface-950 to-nova-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-nova-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-nova-600 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Quality Products<br />
              <span className="bg-gradient-to-r from-nova-400 to-nova-300 bg-clip-text text-transparent">At NOVA</span>
            </h1>
            <p className="text-lg text-surface-400 mb-8">
              Shop from hundreds of trusted sellers. Quality guaranteed, prices you love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="shadow-lg shadow-nova-600/25">
                  Shop Now
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>
      
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Food'].map((cat, i) => (
              <Link key={cat} to="/products" className="group">
                <Card hover className="text-center p-6 cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-nova-600/20 to-nova-600/5 rounded-xl flex items-center justify-center group-hover:from-nova-600/30 transition-all">
                    <span className="text-nova-400 font-bold text-lg">{cat[0]}</span>
                  </div>
                  <span className="text-sm font-medium">{cat}</span>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Zap className="text-nova-400" />
              <h2 className="font-display text-2xl font-bold">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm text-nova-400 hover:text-nova-300 transition-colors">View All →</Link>
          </div>
          {loading ? <Skeleton count={8} variant="rect" /> : <ProductGrid products={products} loading={loading} />}
        </motion.div>
      </section>
      
      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-gradient-to-r from-red-950/50 via-surface-900 to-red-950/30 border border-red-900/30 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Flash Sale</span>
                </div>
                <h2 className="font-display text-3xl font-bold mb-2">Up to 50% Off</h2>
                <p className="text-surface-400">Limited time offers on premium products</p>
              </div>
              <Link to="/products">
                <Button size="lg" variant="danger">Shop Deals</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
