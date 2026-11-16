import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Package, Search, Filter, ShoppingCart } from 'lucide-react';

export default function AdminOrders() {
  const orders = [
    { id: '#NC-10294', customer: 'John Doe', total: 61000, status: 'Processing', date: 'Jan 15' },
    { id: '#NC-10293', customer: 'Jane Smith', total: 45000, status: 'Shipped', date: 'Jan 15' },
    { id: '#NC-10292', customer: 'Bob Wilson', total: 125000, status: 'Paid', date: 'Jan 14' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Order Management</h1>
          <p className="text-surface-400">View and manage all platform orders</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type="text" placeholder="Search orders..." className="bg-surface-900 border border-surface-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500 w-64" />
          </div>
        </div>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Order</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Customer</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Date</th>
                <th className="text-right text-sm font-medium text-surface-400 pb-3">Total</th>
                <th className="text-center text-sm font-medium text-surface-400 pb-3">Status</th>
                <th className="text-right text-sm font-medium text-surface-400 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {orders.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-surface-900/50">
                  <td className="py-4 font-medium text-sm">{order.id}</td>
                  <td className="py-4 text-sm">{order.customer}</td>
                  <td className="py-4 text-sm">{order.date}</td>
                  <td className="py-4 text-right font-medium">{order.total.toLocaleString()} MMK</td>
                  <td className="py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' : order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
