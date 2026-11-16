import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Package, Truck, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const statusSteps = ['Confirmed', 'Prepared', 'In transit', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams();
  const currentStep = 2; // 0-indexed: In transit

  const { data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<any>(`/orders/${id}`),
    enabled: !!id,
  });

  const order = data;

  return (
    <div className="section-shell py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 text-xs text-[#718096]">
          <Link to="/account" className="hover:text-white">Account</Link> / <span className="text-[#a5b3c8]">Order tracking</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">In transit</p>
            <h1 className="mt-3 text-4xl font-light md:text-5xl">Order {order?.order_number || '#NV-02491'}</h1>
            <p className="mt-2 text-sm text-[#718096]">Placed on {order?.created_at || 'January 15, 2026'}</p>
          </div>
          <span className="status-badge">Arrives tomorrow</span>
        </div>

        {/* Progress Timeline */}
        <div className="panel mt-8 p-6 md:p-8">
          <div className="grid grid-cols-4 gap-4">
            {statusSteps.map((step, index) => (
              <div key={step} className="relative text-xs">
                <span className={`mb-3 block h-2 w-2 rounded-full ${index <= currentStep ? 'bg-[#739fff]' : 'bg-white/15'}`} />
                <p className={index <= currentStep ? 'text-white' : 'text-[#718096]'}>{step}</p>
                {index < currentStep && (
                  <div className="absolute left-2 top-[3px] h-px w-[calc(100%-8px)] bg-[#4d8cff]/50" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Items */}
            <div className="panel p-6">
              <h2 className="font-medium mb-5">Order items</h2>
              <div className="space-y-4">
                {[
                  { name: 'Wireless Headphones', qty: 1, price: 45000, image: 'https://picsum.photos/80/80' },
                  { name: 'USB-C Cable', qty: 2, price: 8000, image: 'https://picsum.photos/80/81' },
                ].map((item) => (
                  <div key={item.name} className="flex gap-4 border-b border-white/[0.05] pb-4 last:border-0">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="mt-1 text-xs text-[#718096]">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-medium">{(item.price * item.qty).toLocaleString()} MMK</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="panel p-6">
              <h2 className="font-medium mb-4">Shipping details</h2>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#718096]">Carrier</span>
                  <span>NOVA Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Tracking number</span>
                  <span className="text-[#91acff]">NV-TRK-88291</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Estimated delivery</span>
                  <span>Jan 18–20, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Shipping address</span>
                  <span className="text-right">123 Main St, Yangon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="panel h-fit p-6 lg:sticky lg:top-28">
            <h2 className="font-medium">Order details</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#718096]">Order number</span>
                <span className="font-medium">{order?.order_number || '#NV-02491'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Payment method</span>
                <span>Cash on delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Payment status</span>
                <span className="text-emerald-300">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Shipping</span>
                <span>Standard (3-5 days)</span>
              </div>
            </div>
            <div className="mt-6 space-y-2 border-t border-white/[0.08] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#718096]">Subtotal</span>
                <span>61,000 MMK</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#718096]">Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-4 text-base font-medium">
                <span>Total</span>
                <span>61,000 MMK</span>
              </div>
            </div>
            <Button className="mt-6 w-full" onClick={() => {}}>
              Track on map <ArrowRight size={16} />
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}