import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { CreditCard, MapPin, Check, Truck } from 'lucide-react';

export default function Checkout() {
  const { items } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: '',
    paymentMethod: 'cod' as string,
  });
  
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-surface-400 mb-8">Add items to your cart before checking out.</p>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }
  
  const steps = ['Address', 'Delivery', 'Payment', 'Review'];
  
  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate order creation
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    navigate('/orders/success');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Steps */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-nova-400' : 'text-surface-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 <= step ? 'bg-nova-600 text-white' : 'bg-surface-800 border border-surface-700'}`}>
                {i + 1 < step ? <Check size={16} /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? 'bg-nova-600' : 'bg-surface-800'}`} />}
          </React.Fragment>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin size={18} /> Shipping Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="mt-4">
              <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <Input label="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <Input label="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                <Input label="ZIP Code" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} />
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard size={18} /> Payment Method</h3>
            <div className="space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery (COD)' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'mobile_payment', label: 'Mobile Payment' },
                { value: 'payment_gateway', label: 'Payment Gateway' },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 p-3 rounded-lg border border-surface-700 cursor-pointer hover:border-nova-500/50 transition-colors">
                  <input type="radio" name="payment" value={method.value} checked={formData.paymentMethod === method.value} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="accent-nova-500" />
                  <span className="text-sm">{method.label}</span>
                </label>
              ))}
            </div>
          </Card>
          
          <Button onClick={() => setStep(4)} size="lg" className="w-full">
            Continue to Review
          </Button>
        </div>
        
        <div>
          <Card className="sticky top-20">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{(item.unitPrice * item.quantity).toLocaleString()} MMK</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-surface-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-400">Subtotal</span><span>{subtotal.toLocaleString()} MMK</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Delivery</span><span>{subtotal > 100000 ? 'Free' : '5,000 MMK'}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>{(subtotal + (subtotal > 100000 ? 0 : 5000)).toLocaleString()} MMK</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
