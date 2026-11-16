import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores';
import Button from '../components/ui/Button';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const delivery = subtotal > 100000 ? 0 : 12000;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="section-shell grid min-h-[70vh] place-content-center py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 text-[#718096]" size={40} />
        <h2 className="text-3xl font-light mb-2">Your bag is beautifully empty.</h2>
        <p className="text-sm text-[#718096] mb-8">Discover something exceptional.</p>
        <Link to="/products">
          <Button>Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section-shell py-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Your selection</p>
        <h1 className="mt-3 text-4xl font-light md:text-6xl">Shopping bag.</h1>
        <p className="mt-4 text-sm text-[#718096]">{items.length} curated items</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}
          <div className="space-y-5">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                style={{ boxShadow: 'inset 0 1px #ffffff08' }}
              >
                <img
                  className="h-28 w-24 rounded-xl object-cover"
                  src={item.imageUrl}
                  alt={item.productName}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-[#718096]">{item.sku || 'NOVA'}</p>
                  <p className="mt-1 text-sm font-medium">{item.productName}</p>
                  <p className="mt-1 text-xs text-[#718096]">{item.variantName || 'Standard'}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase">
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-sm font-medium">
                      {(item.unitPrice * item.quantity).toLocaleString()} MMK
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 self-start text-[11px] text-[#718096] underline-offset-4 hover:text-white hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <aside className="panel h-fit p-6 lg:sticky lg:top-28">
            <h2 className="font-medium">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.imageUrl} alt="" className="h-16 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.productName}</p>
                    <p className="mt-1 text-xs text-[#718096]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-xs">{(item.unitPrice * item.quantity).toLocaleString()} MMK</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5 text-sm">
              <div className="flex justify-between text-[#a5b3c8]">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} MMK</span>
              </div>
              <div className="flex justify-between text-[#a5b3c8]">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : `${delivery.toLocaleString()} MMK`}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-4 text-base font-medium">
                <span>Total</span>
                <span>{total.toLocaleString()} MMK</span>
              </div>
            </div>
            <p className="mb-5 mt-2 text-xs text-[#718096]">Shipping calculated at checkout</p>
            <Button className="w-full" onClick={() => navigate('/checkout')}>
              Secure checkout <ArrowRight size={16} />
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}