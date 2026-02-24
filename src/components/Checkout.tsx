import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../types';
import { api } from '../services/api';
import { ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';

interface CheckoutProps {
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
  onBack: () => void;
}

export default function Checkout({ cart, total, onSuccess, onBack }: CheckoutProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const order = {
        ...formData,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total
      };

      const success = await api.createOrder(order);
      if (success) {
        onSuccess();
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <button 
        onClick={onBack}
        className="mb-8 text-slate-500 hover:text-emerald-700 flex items-center gap-2 transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Cart
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="bg-white p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-2xl font-playfair font-semibold mb-6 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-emerald-700" />
            Order Summary
          </h2>
          
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-slate-100 last:border-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-emerald-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center text-xl font-semibold">
              <span>Total</span>
              <span className="text-emerald-700">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="text-3xl font-playfair font-bold mb-2">Checkout</h2>
          <p className="text-slate-500 mb-8">Please enter your details to complete your order.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  value={formData.customerEmail}
                  onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  value={formData.customerPhone}
                  onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Address</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                value={formData.customerAddress}
                onChange={e => setFormData({...formData, customerAddress: e.target.value})}
                placeholder="123 Green Street, Organic City..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-800 text-white py-4 rounded-xl font-medium hover:bg-emerald-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Place Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
