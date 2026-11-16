import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores';
import { api } from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, Store, Phone } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'customer' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post<{ user: any; token: string }>('/auth/register', formData);
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-nova-500 to-nova-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="text-surface-400 mt-2">Join NOVA Commerce marketplace</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
          </div>
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={8} />
          
          <div>
            <label className="text-sm font-medium text-surface-300 mb-2 block">Register as</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({...formData, role: 'customer'})} className={`p-3 rounded-lg border text-sm transition-all ${formData.role === 'customer' ? 'border-nova-500 bg-nova-500/10 text-nova-400' : 'border-surface-700 text-surface-400'}`}>
                <User size={18} className="mx-auto mb-1" />Customer
              </button>
              <button type="button" onClick={() => setFormData({...formData, role: 'seller'})} className={`p-3 rounded-lg border text-sm transition-all ${formData.role === 'seller' ? 'border-nova-500 bg-nova-500/10 text-nova-400' : 'border-surface-700 text-surface-400'}`}>
                <Store size={18} className="mx-auto mb-1" />Seller
              </button>
            </div>
          </div>
          
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
