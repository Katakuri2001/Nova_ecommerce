import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Store, Package, PackageCheck, Settings, LogOut, ChevronDown, Upload } from 'lucide-react';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { label: 'Revenue', value: '2,450,000 MMK', change: '+12.5%' },
    { label: 'Orders', value: '156', change: '+8.2%' },
    { label: 'Products', value: '42', change: '+3' },
    { label: 'Rating', value: '4.8', change: '+0.2' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-surface-400">Welcome back! Here's your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/seller/products')}>My Products</Button>
          <Button variant="outline">Settings</Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <p className="text-sm text-surface-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-green-400 mt-1">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-surface-800">
        {[
          { id: 'overview', label: 'Overview', icon: Package },
          { id: 'orders', label: 'Orders', icon: PackageCheck },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'analytics', label: 'Analytics', icon: Package },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? 'border-nova-500 text-nova-400' : 'border-transparent text-surface-400 hover:text-white'}`}>
            <Icon size={16} className="inline mr-1" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card>
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[
              { id: '#NC-10294', items: 2, total: 61000, status: 'Processing' },
              { id: '#NC-10293', items: 1, total: 45000, status: 'Shipped' },
              { id: '#NC-10292', items: 3, total: 125000, status: 'Paid' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-900/50">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-surface-500">{order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{order.total.toLocaleString()} MMK</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' : order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {activeTab === 'orders' && (
        <Card>
          <h3 className="font-semibold mb-4">Manage Orders</h3>
          <p className="text-surface-400 text-sm">Your order management interface will appear here.</p>
          <div className="mt-4 space-y-3">
            {['#NC-10294', '#NC-10293', '#NC-10292'].map((orderId) => (
              <div key={orderId} className="flex items-center justify-between p-3 rounded-lg bg-surface-900/50">
                <span className="font-medium">{orderId}</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {activeTab === 'products' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">My Products</h3>
            <Button size="sm">Add Product</Button>
          </div>
          <p className="text-surface-400 text-sm">Manage your product listings here.</p>
        </Card>
      )}
    </div>
  );
}
