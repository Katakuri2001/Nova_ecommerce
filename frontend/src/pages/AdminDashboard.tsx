import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Package, Users, ShoppingCart, BarChart3, Settings, Shield, Wallet, Gift } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, change, color }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-surface-400">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs">
        <span className="text-green-400">{change}</span>
        <span className="text-surface-500">vs last period</span>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const stats = [
    { icon: Users, label: 'Total Users', value: '12,847', change: '+5.2%', color: 'bg-nova-600/20 text-nova-400' },
    { icon: Shield, label: 'Active Sellers', value: '1,234', change: '+12.1%', color: 'bg-green-600/20 text-green-400' },
    { icon: Package, label: 'Total Products', value: '24,567', change: '+8.3%', color: 'bg-purple-600/20 text-purple-400' },
    { icon: ShoppingCart, label: 'Orders Today', value: '892', change: '+3.7%', color: 'bg-amber-600/20 text-amber-400' },
    { icon: Wallet, label: 'Revenue', value: '45.2M MMK', change: '+18.4%', color: 'bg-emerald-600/20 text-emerald-400' },
    { icon: Gift, label: 'Coupons Used', value: '3,421', change: '+22.1%', color: 'bg-rose-600/20 text-rose-400' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-surface-400">Overview of the NOVA Commerce platform</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: 'Manage Users', action: () => navigate('/admin/users') },
              { icon: Shield, label: 'Manage Sellers', action: () => {} },
              { icon: Package, label: 'Manage Products', action: () => navigate('/admin/products') },
              { icon: ShoppingCart, label: 'Manage Orders', action: () => navigate('/admin/orders') },
              { icon: Gift, label: 'Coupons', action: () => {} },
              { icon: Settings, label: 'Settings', action: () => {} },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={action} className="flex items-center gap-3 p-3 rounded-lg bg-surface-900/50 hover:bg-surface-800 transition-colors text-left">
                <Icon size={18} className="text-nova-400" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </Card>
        
        <Card>
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New seller registered', time: '2 min ago', icon: '👤' },
              { action: 'Order #NC-10294 paid', time: '5 min ago', icon: '💳' },
              { action: 'Product "Wireless Earbuds" approved', time: '12 min ago', icon: '✅' },
              { action: 'Refund request received', time: '1 hr ago', icon: '↩️' },
              { action: 'New seller application pending', time: '2 hrs ago', icon: '📋' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.action}</span>
                </div>
                <span className="text-xs text-surface-500">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
