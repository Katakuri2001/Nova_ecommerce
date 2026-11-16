import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Minus, Plus, Heart, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Button from '../components/ui/Button';
import ProductCard from '../components/products/ProductCard';
import { useCartStore } from '../stores';
import { useWishlistStore } from '../stores';

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
  images?: { image_url: string }[];
  seller_name?: string;
  brand?: string;
  category?: string;
  description?: string;
  in_stock?: boolean;
  variants?: { id: string; name: string; price_modifier?: number; stock_quantity?: number }[];
  badge?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const [color, setColor] = useState('Graphite');
  const [size, setSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  });

  const product = data;
  const liked = product ? isInWishlist(String(product.id)) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: String(product.id),
      productVariantId: String(product.id),
      productName: product.name,
      variantName: '',
      imageUrl: product.image,
      quantity,
      unitPrice: product.price,
      sku: '',
    });
  };

  if (isLoading) {
    return (
      <div className="section-shell py-8 md:py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-48 rounded bg-[#111724]" />
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="aspect-[4/5] rounded-2xl bg-[#111724]" />
            <div className="space-y-4">
              <div className="h-6 w-24 rounded bg-[#111724]" />
              <div className="h-10 w-3/4 rounded bg-[#111724]" />
              <div className="h-4 w-1/2 rounded bg-[#111724]" />
              <div className="h-8 w-1/3 rounded bg-[#111724]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-shell py-24 text-center">
        <h2 className="text-3xl font-light mb-4">Product not found</h2>
        <p className="text-[#718096] mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const images = product.images?.map((img) => img.image_url) || [product.image];
  const reviewCount = product.reviews || product.review_count || 0;

  return (
    <>
      <div className="section-shell py-8 md:py-12">
        <div className="mb-7 text-xs text-[#718096]">
          Home / {product.category || 'Products'} / <span className="text-[#a5b3c8]">{product.name}</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Gallery */}
          <div className="grid gap-3 sm:grid-cols-[84px_1fr]">
            <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border ${index === selectedImage ? 'border-white/40' : 'border-white/[0.07]'}`}
                >
                  <img src={image} alt="" className="aspect-square h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 overflow-hidden rounded-2xl bg-[#111724] sm:order-2">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6 }}
                src={images[selectedImage]}
                alt={product.name}
                className="aspect-[4/5] h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{product.brand || product.seller_name}</p>
            <h1 className="mt-4 text-3xl font-light md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Star size={14} fill="#b8c7ff" className="text-[#b8c7ff]" /> {product.rating}
              </span>
              <span className="text-[#718096]">({reviewCount} reviews)</span>
            </div>
            <div className="mt-7 flex items-end gap-3">
              <span className="text-2xl font-medium">{product.price.toLocaleString()} MMK</span>
              {(product.compare_at_price || product.oldPrice) && (
                <span className="pb-1 text-sm text-[#718096] line-through">
                  {(product.compare_at_price || product.oldPrice)!.toLocaleString()} MMK
                </span>
              )}
            </div>
            <p className="mt-6 text-sm leading-7 text-[#a5b3c8]">
              {product.description || 'Engineered with obsessive attention to material and detail. A refined expression of function, designed to become part of your everyday.'}
            </p>

            {/* Finish */}
            <div className="mt-8 border-t border-white/[0.08] pt-7">
              <div className="flex justify-between text-sm">
                <span>Finish</span>
                <span className="text-[#718096]">{color}</span>
              </div>
              <div className="mt-4 flex gap-3">
                {['Graphite', 'Silver', 'Midnight'].map((item, index) => (
                  <button
                    key={item}
                    onClick={() => setColor(item)}
                    className={`h-9 w-9 rounded-full border-2 p-1 ${color === item ? 'border-white' : 'border-transparent'}`}
                    aria-label={item}
                  >
                    <span
                      className={`block h-full w-full rounded-full ${['bg-[#30343b]', 'bg-[#bdc4cd]', 'bg-[#11172b]'][index]}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div className="mt-7">
              <div className="flex justify-between text-sm">
                <span>Configuration</span>
                <span className="text-[#718096]">{size}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {['Standard', 'Studio', 'Creator'].map((item) => (
                  <button
                    onClick={() => setSize(item)}
                    key={item}
                    className={`variant-btn ${size === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <div className="quantity-control large">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <button className="btn-primary flex-1" onClick={handleAddToCart}>
                Add to bag <ArrowRight size={16} />
              </button>
              <button
                className={`icon-square ${liked ? 'text-[#91acff]' : ''}`}
                onClick={() => product && addToWishlist(String(product.id))}
              >
                <Heart size={19} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button className="mt-3 w-full rounded-full border border-white/15 py-3.5 text-sm font-medium hover:bg-white hover:text-black">
              Buy now
            </button>

            {/* Shipping Info */}
            <div className="mt-7 grid gap-3 border-t border-white/[0.08] pt-6 text-xs text-[#a5b3c8] sm:grid-cols-3">
              <span className="flex items-center gap-2"><Truck size={16} /> Free delivery</span>
              <span className="flex items-center gap-2"><RotateCcw size={16} /> 14-day returns</span>
              <span className="flex items-center gap-2"><ShieldCheck size={16} /> Authenticity</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-t border-white/[0.08] pt-10">
          <div className="flex gap-8 overflow-x-auto border-b border-white/[0.08] text-sm text-[#718096]">
            {['The details', 'Specifications', `Reviews (${reviewCount})`, 'Questions'].map((item, index) => (
              <button
                key={item}
                onClick={() => setActiveTab(index)}
                className={`shrink-0 pb-4 ${activeTab === index ? 'border-b border-white text-white' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-8 py-10 md:grid-cols-2">
            <h2 className="text-3xl font-light">
              Quietly exceptional,
              <br />
              from every angle.
            </h2>
            <p className="text-sm leading-7 text-[#718096]">
              Every touchpoint has been refined for clarity and tactility. Premium materials,
              intuitive controls, and enduring construction make this an object designed not just to
              perform, but to belong.
            </p>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Complete the collection</p>
              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-5xl">You may also like.</h2>
            </div>
            <Link to="/products" className="hidden items-center gap-2 text-sm text-[#a5b3c8] hover:text-white sm:flex">
              Explore all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Related products would go here */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}