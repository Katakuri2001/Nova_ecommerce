import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { useCartStore } from '../stores';
import { useWishlistStore } from '../stores';
import { addDays } from 'date-fns';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedVariant, setSelectedVariant] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<any>(`/products/${id}`),
    enabled: !!id,
  });
  
  const product = data;
  
  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    addItem({
      id: product.id,
      productVariantId: product.variants?.[selectedVariant]?.id || product.id,
      productName: product.name,
      variantName: product.variants?.[selectedVariant]?.name || 'Default',
      imageUrl: product.images?.[0]?.image_url || '',
      quantity,
      unitPrice: (product.base_price || 0) + (product.variants?.[selectedVariant]?.price_modifier || 0),
      sku: product.variants?.[selectedVariant]?.sku || product.sku,
    });
    setIsAdding(false);
  };
  
  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-8 w-48" /><Skeleton className="h-96 w-full" /><Skeleton className="h-8 w-64" />
    </div>;
  }
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Product not found</h2>
        <p className="text-surface-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-nova-400 hover:text-nova-300 transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    );
  }
  
  const discount = product.compare_at_price ? Math.round((1 - (product.base_price || 0) / product.compare_at_price) * 100) : 0;
  const currentPrice = (product.base_price || 0) + (product.variants?.[selectedVariant]?.price_modifier || 0);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-nova-400 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-900 mb-4">
            <img
              src={product.images?.[selectedImage]?.image_url || product.images?.[0]?.image_url || 'https://picsum.photos/800/800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(product.images || []).map((img: any, i: number) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-nova-500' : 'border-transparent hover:border-surface-600'}`}>
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <p className="text-sm text-nova-400 font-medium mb-2">{product.seller_name}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="fill-amber-400 text-amber-400" size={18} />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-surface-500">({product.review_count} reviews)</span>
          </div>
          
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">{currentPrice.toLocaleString()} MMK</span>
            {product.compare_at_price && (
              <>
                <span className="text-lg text-surface-500 line-through">{product.compare_at_price.toLocaleString()} MMK</span>
                {discount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">-{discount}%</span>}
              </>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm ${product.in_stock ? 'text-green-400' : 'text-red-400'}`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Variants */}
          <div className="space-y-4 mb-6">
            {product.variants && product.variants.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-surface-300 mb-2">Variant</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any, i: number) => (
                    <button key={v.id} onClick={() => setSelectedVariant(i)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${i === selectedVariant ? 'border-nova-500 bg-nova-500/10 text-nova-400' : 'border-surface-700 text-surface-400 hover:border-surface-600'}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-surface-300 mb-2">Quantity</h4>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg border border-surface-700 flex items-center justify-center hover:bg-surface-800 transition-colors">-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-lg border border-surface-700 flex items-center justify-center hover:bg-surface-800 transition-colors">+</button>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={!product.in_stock} className="flex-1 bg-nova-600 hover:bg-nova-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <ShoppingCart size={20} />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button onClick={() => addToWishlist(product.id)} className={`p-3 rounded-xl border transition-colors ${isInWishlist(product.id) ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-surface-700 hover:bg-surface-800'}`}>
              <Heart fill={isInWishlist(product.id) ? '#ef4444' : 'none'} className={isInWishlist(product.id) ? 'text-red-400' : 'text-surface-400'} size={20} />
            </button>
          </div>
          
          {/* Shipping Info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Truck, text: 'Free shipping over 100K MMK' },
              { icon: Shield, text: 'Secure payment' },
              { icon: RotateCcw, text: 'Easy returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="text-center">
                <Icon size={18} className="mx-auto mb-1 text-nova-400" />
                <p className="text-[10px] text-surface-500">{text}</p>
              </div>
            ))}
          </div>
          
          {/* Description */}
          <div className="border-t border-surface-800 pt-6">
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p className="text-sm text-surface-400 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
