import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Users, UserCheck, UserX, Search, Filter } from 'lucide-react';

export default function AdminUsers() {
  const navigate = useNavigate();
  
  const users = [
    { id: 'u1', name: 'John Doe', email: 'john@mail.com', role: 'customer', status: 'active', orders: 12 },
    { id: 'u2', name: 'Jane Smith', email: 'jane@mail.com', role: 'seller', status: 'active', orders: 0 },
    { id: 'u3', name: 'Bob Wilson', email: 'bob@mail.com', role: 'customer', status: 'suspended', orders: 3 },
    { id: 'u4', name: 'Alice Brown', email: 'alice@mail.com', role: 'seller', status: 'pending', orders: 0 },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">User Management</h1>
          <p className="text-surface-400">Manage customer and seller accounts</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input type="text" placeholder="Search users..." className="bg-surface-900 border border-surface-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-nova-500 w-64" />
          </div>
        </div>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left text-sm font-medium text-surface-400 pb-3">User</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Role</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Status</th>
                <th className="text-left text-sm font-medium text-surface-400 pb-3">Orders</th>
                <th className="text-right text-sm font-medium text-surface-400 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {users.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-surface-900/50 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-surface-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded ${user.role === 'seller' ? 'bg-nova-600/10 text-nova-400' : 'bg-surface-800 text-surface-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded ${user.status === 'active' ? 'bg-green-500/10 text-green-400' : user.status === 'suspended' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm">{user.orders}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      {user.status !== 'active' && <Button size="sm">Activate</Button>}
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
