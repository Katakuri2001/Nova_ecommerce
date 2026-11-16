import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Package, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminProducts() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Product Management</h1>
          <p className="text-surface-400">Moderate all products on the platform</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type="text" placeholder="Search products..." className="bg-surface-900 border border-surface-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500 w-64" />
          </div>
          <Button><Plus size={18} className="mr-1" />Add Product</Button>
        </div>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Product</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Seller</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Category</th>
                <th className="text-right text-sm font-medium text-surface-400 pb-3">Price</th>
                <th className="text-center text-sm font-medium text-surface-400 pb-3">Stock</th>
                <th className="text-center text-sm font-medium text-surface-400 pb-3">Status</th>
                <th className="text-right text-sm font-medium text-surface-400 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {[
                { name: 'Wireless Headphones', seller: 'AudioTech', category: 'Electronics', price: 45000, stock: 150, status: 'active' },
                { name: 'Smart Watch Pro', seller: 'TechGear', category: 'Electronics', price: 120000, stock: 0, status: 'active' },
                { name: 'Mechanical Keyboard', seller: 'KeyMaster', category: 'Computers', price: 65000, stock: 42, status: 'draft' },
              ].map((product, i) => (
                <motion.tr key={product.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-surface-900/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/40/${40 + i}`} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm">{product.seller}</td>
                  <td className="py-4 text-sm">{product.category}</td>
                  <td className="py-4 text-right font-medium">{product.price.toLocaleString()} MMK</td>
                  <td className="py-4 text-center">{product.stock}</td>
                  <td className="py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${product.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{product.status}</span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">👁</Button>
                      <Button variant="ghost" size="sm">✏️</Button>
                    </div>
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
