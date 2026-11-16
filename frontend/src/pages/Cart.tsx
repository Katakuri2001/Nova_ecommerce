import React from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../stores';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ShoppingCart, ArrowLeft, Trash2, MapPin, Truck, Shield, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = subtotal * 0.05;
  const delivery = subtotal > 100000 ? 0 : 5000;
  const tax = subtotal * 0.05;
  const total = subtotal - discount + delivery + tax;
  const remaining = 100000 - subtotal;
  
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingCart size={64} className="mx-auto text-surface-700 mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-surface-400 mb-8">Browse our products and add something special.</p>
        <Link to="/products"><Button>Start Shopping</Button></Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="flex gap-4">
                <img src={item.imageUrl} alt={item.productName} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-sm text-surface-500">{item.variantName}</p>
                  <p className="text-sm text-nova-400 mt-1">{item.unitPrice.toLocaleString()} MMK</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-surface-700 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-surface-800 rounded-l-lg">−</button>
                    <span className="px-4 py-1 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-surface-800 rounded-r-lg">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div>
          <Card className="sticky top-20">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Subtotal</span>
                <span>{subtotal.toLocaleString()} MMK</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Discount</span>
                <span className="text-green-400">-{discount.toLocaleString()} MMK</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Delivery</span>
                <span>{delivery === 0 ? 'Free' : `${delivery.toLocaleString()} MMK`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-400">Tax</span>
                <span>{tax.toLocaleString()} MMK</span>
              </div>
              <div className="border-t border-surface-800 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>{total.toLocaleString()} MMK</span>
              </div>
            </div>
            
            {remaining > 0 && (
              <motion.div className="mb-4 bg-nova-600/10 border border-nova-600/20 rounded-lg p-3 text-sm text-nova-400">
                <p>You're {remaining.toLocaleString()} MMK away from free delivery!</p>
              </motion.div>
            )}
            
            <Link to="/checkout">
              <Button className="w-full" size="lg">
                <ShoppingCart size={18} />
                Proceed to Checkout
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 mt-4 text-xs text-surface-500 justify-center">
              <Shield size={14} />
              <span>Secure checkout</span>
              <span>•</span>
              <Truck size={14} />
              <span>Free shipping over 100K</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
