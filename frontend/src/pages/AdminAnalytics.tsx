import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { TrendingUp, ShoppingCart, Users, DollarSign, Package, ShoppingBag, BarChart3 } from 'lucide-react';

export default function AdminAnalytics() {
  const data = {
    totalSales: 45200000,
    platformRevenue: 4520000,
    sellerCommission: 3616000,
    totalOrders: 2847,
    totalCustomers: 12847,
    activeSellers: 1234,
    totalProducts: 24567,
    refunds: 234,
    conversionRate: 3.2,
    avgOrderValue: 15880,
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Platform Analytics</h1>
          <p className="text-surface-400">Track platform-wide performance metrics</p>
        </div>
        <select className="bg-surface-900 border border-surface-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-nova-500">
          <option>Today</option>
          <option>7 Days</option>
          <option>30 Days</option>
          <option>90 Days</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: DollarSign, label: 'Total Sales', value: '45.2M MMK', change: '+18.4%', color: 'bg-emerald-600/20 text-emerald-400' },
          { icon: DollarSign, label: 'Platform Revenue', value: '4.52M MMK', change: '+22.1%', color: 'bg-nova-600/20 text-nova-400' },
          { icon: ShoppingCart, label: 'Total Orders', value: '2,847', change: '+8.3%', color: 'bg-purple-600/20 text-purple-400' },
          { icon: Users, label: 'Total Customers', value: '12,847', change: '+5.2%', color: 'bg-green-600/20 text-green-400' },
          { icon: Package, label: 'Total Products', value: '24,567', change: '+12%', color: 'bg-amber-600/20 text-amber-400' },
          { icon: ShoppingBag, label: 'Refunds', value: '234', change: '-3.1%', color: 'bg-rose-600/20 text-rose-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-surface-400">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-green-400 mt-3">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <Card>
        <h3 className="font-semibold mb-4">Revenue Trend</h3>
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 50, 100].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-1 bg-gradient-to-t from-nova-600/40 to-nova-600/10 rounded-t-sm hover:from-nova-600/60 transition-colors"
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 px-2 text-xs text-surface-500">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
