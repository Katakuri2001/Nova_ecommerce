import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useWishlistStore } from '../../stores';
import { useCartStore } from '../../stores';

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

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const discount = product.compare_at_price ? Math.round((1 - product.price / product.compare_at_price) * 100) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/products/${product.slug}`}>
        <Card hover className="group">
          <div className="relative overflow-hidden rounded-t-xl mb-4">
            {!imageLoaded && <Skeleton className="h-56 w-full" />}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-surface-900 text-white px-3 py-1 rounded-lg text-sm font-medium">Out of Stock</span>
              </div>
            )}
            <button
              onClick={(e) => { e.preventDefault(); addToWishlist(product.id); }}
              className="absolute top-3 right-3 p-2 bg-surface-900/80 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-800"
            >
              <Heart size={18} fill={isInWishlist(product.id) ? '#ef4444' : 'none'} className={isInWishlist(product.id) ? 'text-red-500' : 'text-white'} />
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-nova-400 font-medium">{product.seller_name}</p>
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-nova-400 transition-colors leading-tight">{product.name}</h3>
            
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-surface-500">({product.review_count})</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{product.price.toLocaleString()} MMK</span>
              {product.compare_at_price && (
                <span className="text-sm text-surface-500 line-through">{product.compare_at_price.toLocaleString()} MMK</span>
              )}
            </div>
            
            <button
              onClick={(e) => { e.preventDefault(); addItem({ id: product.id, productVariantId: product.id, productName: product.name, variantName: '', imageUrl: product.image, quantity: 1, unitPrice: product.price, sku: '' }); }}
              className="w-full bg-nova-600 hover:bg-nova-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}><Skeleton className="h-56 w-full" /><Skeleton className="h-4 w-3/4 mt-3" /><Skeleton className="h-4 w-1/2 mt-2" /><Skeleton className="h-8 w-full mt-4" /></Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
