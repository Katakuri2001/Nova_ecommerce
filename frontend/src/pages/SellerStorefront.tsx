import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Package, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProductCard from '../components/products/ProductCard';

export default function SellerStorefront() {
  const { slug } = useParams();
  
  const store = {
    name: 'TechGear Pro',
    slug: 'techgear-pro',
    rating: 4.8,
    review_count: 234,
    product_count: 42,
    follower_count: 1240,
    banner: 'https://picsum.photos/1200/300',
    logo: 'https://picsum.photos/100/100',
    description: 'Premium tech accessories for everyone. Quality guaranteed.',
  };
  
  const products = Array.from({ length: 6 }, (_, i) => ({
    id: `p${i}`,
    name: ['Wireless Earbuds', 'Smart Watch', 'USB-C Hub', 'Laptop Stand', 'Mechanical Keyboard', 'Webcam HD'][i],
    slug: `product-${i}`,
    price: [45000, 120000, 35000, 25000, 65000, 55000][i],
    image: `https://picsum.photos/${400 + i * 10}/${400 + i * 10}`,
    seller_name: store.name,
    rating: [4.8, 4.5, 4.2, 4.9, 4.6, 4.3][i],
    review_count: [120, 89, 45, 67, 234, 56][i],
    in_stock: true,
    compare_at_price: [55000, 150000, undefined, undefined, 80000, undefined][i],
  }));
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Store Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img src={store.banner} alt={store.name} className="w-full h-48 sm:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent" />
        <div className="absolute -bottom-12 left-4 sm:left-8">
          <div className="flex gap-4 items-end">
            <img src={store.logo} alt={store.name} className="w-20 h-20 rounded-xl border-2 border-surface-900" />
            <div>
              <h1 className="font-display text-2xl font-bold">{store.name}</h1>
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Star className="fill-amber-400 text-amber-400" size={16} />
                <span className="font-medium">{store.rating}</span>
                <span>({store.review_count} reviews)</span>
                <span>•</span>
                <span>{store.product_count} products</span>
                <span>•</span>
                <span>{store.follower_count.toLocaleString()} followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Store Tabs */}
      <div className="flex gap-6 mb-8 border-b border-surface-800">
        {['Featured Products', 'All Products', 'Reviews', 'About'].map((tab) => (
          <button key={tab} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === 'Featured Products' ? 'border-nova-500 text-nova-400' : 'border-transparent text-surface-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>
      
      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
