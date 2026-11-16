import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Plus } from 'lucide-react';
import { useWishlistStore } from '../../stores';
import { useCartStore } from '../../stores';

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  oldPrice?: number;
  compare_at_price?: number;
  rating: number;
  reviews?: number;
  review_count?: number;
  image?: string;
  image_url?: string;
  brand?: string;
  seller_name?: string;
  in_stock?: boolean;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const liked = isInWishlist(String(product.id));

  const discount = product.compare_at_price || product.oldPrice
    ? Math.round((1 - product.price / (product.compare_at_price || product.oldPrice!)) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.24) }}
      className="product-card group"
    >
      <Link to={`/products/${product.slug || product.id}`} className="product-image-wrap">
        <img src={product.image || product.image_url || 'https://picsum.photos/400/500'} alt={product.name} className="product-image" loading="lazy" />
        <span className="image-scrim" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </Link>
      <button
        onClick={() => addToWishlist(String(product.id))}
        className={`wishlist-btn ${liked ? 'is-active' : ''}`}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
      </button>
      <div className="pt-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#718096]">
            {product.brand || product.seller_name}
          </p>
          <span className="flex items-center gap-1 text-xs text-[#a5b3c8]">
            <Star size={12} fill="#b8c7ff" className="text-[#b8c7ff]" />
            {product.rating}
          </span>
        </div>
        <Link
          to={`/products/${product.slug || product.id}`}
          className="text-[15px] font-medium text-white/90 hover:text-white"
        >
          {product.name}
        </Link>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{product.price.toLocaleString()} MMK</span>
          {(product.compare_at_price || product.oldPrice) && (
            <span className="text-xs text-[#718096] line-through">
              {(product.compare_at_price || product.oldPrice)!.toLocaleString()} MMK
            </span>
          )}
        </div>
        <button
          onClick={() => addItem({
            id: String(product.id),
            productVariantId: String(product.id),
            productName: product.name,
            variantName: '',
            imageUrl: product.image || product.image_url || '',
            quantity: 1,
            unitPrice: product.price,
            sku: '',
          })}
          className="quick-add"
        >
          Quick add <Plus size={14} />
        </button>
      </div>
    </motion.article>
  );
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] rounded-xl bg-[#111724]" />
            <div className="mt-4 h-3 w-3/4 rounded bg-[#111724]" />
            <div className="mt-2 h-3 w-1/2 rounded bg-[#111724]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}