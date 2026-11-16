import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, PackageCheck } from 'lucide-react';
import { useCartStore } from '../stores';
import Button from '../components/ui/Button';

export default function Checkout() {
  const { items } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const total = subtotal + 12000;

  if (step === 4) {
    return (
      <div className="section-shell grid min-h-[75vh] place-content-center py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-content-center rounded-full bg-[#4d8cff]/15 text-[#91acff]">
          <PackageCheck size={30} />
        </div>
        <p className="eyebrow mt-6">Order NV-02491</p>
        <h1 className="mt-3 text-4xl font-light">Your order is confirmed.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#718096]">
          We'll send delivery updates to your email. Estimated arrival is within 2–3 business days.
        </p>
        <Button className="mx-auto mt-8" onClick={() => navigate('/orders/1')}>
          Track your order <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  const steps = ['Delivery', 'Method', 'Payment'];

  return (
    <div className="section-shell py-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-center">Secure checkout</p>
        <div className="mx-auto mt-6 flex max-w-xl items-center">
          {steps.map((label, index) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <button
                className={`checkout-step ${step >= index + 1 ? 'is-active' : ''}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
              >
                <span>{step > index + 1 ? '✓' : index + 1}</span>
                {label}
              </button>
              {index < steps.length - 1 && (
                <div className={`mx-3 h-px flex-1 ${step > index + 1 ? 'bg-[#4d8cff]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="panel p-6 md:p-8">
            <h1 className="text-2xl font-light">{steps[step - 1]}</h1>
            <p className="mt-2 text-sm text-[#718096]">
              {step === 1
                ? 'Where should we send your order?'
                : step === 2
                  ? 'Choose how your order arrives.'
                  : 'Select a secure payment option.'}
            </p>
            {step === 1 && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {['First name', 'Last name', 'Email address', 'Phone number', 'Street address', 'City / Township'].map(
                  (label, index) => (
                    <label key={label} className={index >= 4 ? 'sm:col-span-2' : ''}>
                      <span className="input-label">{label}</span>
                      <input className="field" placeholder={label} />
                    </label>
                  )
                )}
              </div>
            )}
            {step === 2 && (
              <div className="mt-7 space-y-3">
                {[
                  ['Express delivery', '1–2 business days', '12,000 MMK'],
                  ['Standard delivery', '3–5 business days', 'Free'],
                  ['NOVA pickup', 'Tomorrow after 2 PM', 'Free'],
                ].map(([title, note, price], index) => (
                  <label key={title} className={`option-card ${index === 0 ? 'is-active' : ''}`}>
                    <input type="radio" defaultChecked={index === 0} name="delivery" />
                    <Truck size={19} />
                    <span className="flex-1">
                      <b>{title}</b>
                      <small>{note}</small>
                    </span>
                    <b>{price}</b>
                  </label>
                ))}
              </div>
            )}
            {step === 3 && (
              <div className="mt-7 space-y-3">
                {[
                  'Mobile payment · KBZPay / WavePay',
                  'Payment gateway · Visa / Mastercard',
                  'Cash on delivery',
                  'Bank transfer',
                ].map((title, index) => (
                  <label key={title} className={`option-card ${index === 0 ? 'is-active' : ''}`}>
                    <input type="radio" defaultChecked={index === 0} name="payment" />
                    <ShieldCheck size={19} />
                    <span className="flex-1">
                      <b>{title}</b>
                      <small>{index === 0 ? 'Confirm securely on your phone' : 'Secure and protected'}</small>
                    </span>
                  </label>
                ))}
              </div>
            )}
            <Button className="mt-8 w-full sm:w-auto" onClick={() => setStep(step + 1)}>
              {step === 3 ? 'Place order' : 'Continue'} <ArrowRight size={16} />
            </Button>
          </div>
          <aside className="panel h-fit p-6 lg:sticky lg:top-28">
            <h2 className="font-medium">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.imageUrl} alt="" className="h-16 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.productName}</p>
                    <p className="mt-1 text-xs text-[#718096]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-xs">{(item.unitPrice * item.quantity).toLocaleString()} MMK</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5 text-sm">
              <div className="flex justify-between text-[#718096]">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} MMK</span>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span>Delivery</span>
                <span>12,000 MMK</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-4 text-base font-medium">
                <span>Total</span>
                <span>{total.toLocaleString()} MMK</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}