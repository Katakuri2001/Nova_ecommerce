import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, Truck, Shield, Clock, ArrowLeft, Check } from 'lucide-react';
import Card from '../components/ui/Card';

const statusSteps = ['Order Placed', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams();
  const currentStatus = 3; // Shipped
  
  const statuses = [
    { status: 'PENDING', label: 'Order Placed', date: 'Jan 15, 2026 10:30 AM' },
    { status: 'PAYMENT_PENDING', label: 'Payment Confirmed', date: 'Jan 15, 2026 10:32 AM' },
    { status: 'PAID', label: 'Payment Processed', date: 'Jan 15, 2026 10:33 AM' },
    { status: 'PROCESSING', label: 'Processing', date: 'Jan 15, 2026 2:00 PM' },
    { status: 'PACKED', label: 'Packed', date: 'Jan 15, 2026 4:00 PM' },
    { status: 'SHIPPED', label: 'Shipped', date: 'Jan 16, 2026 9:00 AM' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', date: '—' },
    { status: 'DELIVERED', label: 'Delivered', date: '—' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-nova-400 mb-6">
        <ArrowLeft size={16} /> Back to Orders
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold">Order #NC-10294</h1>
                <p className="text-sm text-surface-400">Placed on January 15, 2026</p>
              </div>
              <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-sm font-medium self-start">
                Processing
              </span>
            </div>
          </Card>
          
          {/* Order Items */}
          <Card>
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {[
                { name: 'Wireless Headphones', qty: 1, price: 45000, image: 'https://picsum.photos/80/80' },
                { name: 'USB-C Cable', qty: 2, price: 8000, image: 'https://picsum.photos/80/81' },
              ].map((item) => (
                <div key={item.name} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-surface-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-medium text-sm">{(item.price * item.qty).toLocaleString()} MMK</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Status Timeline */}
          <Card>
            <h3 className="font-semibold mb-6">Order Status</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-800" />
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-nova-500/30" style={{ height: `${(currentStatus / statuses.length) * 100}%` }} />
              
              <div className="space-y-6">
                {statuses.map((item, i) => {
                  const isActive = i <= currentStatus;
                  const isCurrent = i === currentStatus;
                  return (
                    <div key={item.status} className="relative flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${isActive ? 'bg-nova-600 text-white' : 'bg-surface-800 text-surface-500'}`}>
                        {isActive ? <Check size={16} /> : i + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-surface-500'}`}>{item.label}</p>
                        <p className="text-xs text-surface-500">{item.date}</p>
                        {isCurrent && <span className="text-xs text-nova-400 mt-1 inline-block">Current</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-20 space-y-4">
            <h3 className="font-semibold">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-surface-400">Order Number</span><span className="font-medium">#NC-10294</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Payment Method</span><span>Cash on Delivery</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Payment Status</span><span className="text-green-400">Paid</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Shipping</span><span>Standard (3-5 days)</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Est. Delivery</span><span className="font-medium">Jan 18-20, 2026</span></div>
            </div>
            
            <div className="border-t border-surface-800 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-surface-400">Subtotal</span><span>61,000 MMK</span></div>
              <div className="flex justify-between text-sm"><span className="text-surface-400">Delivery</span><span>Free</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>61,000 MMK</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
