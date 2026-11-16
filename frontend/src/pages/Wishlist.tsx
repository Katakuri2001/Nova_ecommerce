import React from 'react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../stores';
import { Heart, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Wishlist() {
  const { items, removeItem, addItem } = useWishlistStore();
  
  const products = [
    { id: '1', name: 'Premium Wireless Earbuds', price: 45000, image: 'https://picsum.photos/400/400', seller: 'AudioTech', rating: 4.8, inStock: true },
    { id: '2', name: 'Smart Watch Pro', price: 120000, image: 'https://picsum.photos/401/401', seller: 'TechGear', rating: 4.5, inStock: true },
    { id: '3', name: 'Mechanical Keyboard RGB', price: 65000, image: 'https://picsum.photos/402/402', seller: 'KeyMaster', rating: 4.9, inStock: false },
  ];
  
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Heart size={64} className="mx-auto text-surface-700 mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-surface-400 mb-8">Save items you love for later.</p>
        <Button onClick={() => {}}>Start Shopping</Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="group">
              <div className="relative overflow-hidden rounded-t-xl mb-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                {!product.inStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-surface-900 px-3 py-1 rounded text-sm">Out of Stock</span></div>}
                <button onClick={() => removeItem(product.id)} className="absolute top-3 right-3 p-2 bg-surface-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={18} className="fill-red-500 text-red-500" />
                </button>
              </div>
              <p className="text-xs text-nova-400 mb-1">{product.seller}</p>
              <h3 className="font-medium mb-2 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold">{product.price.toLocaleString()} MMK</span>
                <span className="text-xs text-surface-500">★ {product.rating}</span>
              </div>
              <div className="flex gap-2">
                <button disabled={!product.inStock} className="flex-1 bg-nova-600 hover:bg-nova-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                  <ShoppingCart size={16} /> Move to Cart
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
