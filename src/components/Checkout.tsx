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
        className="mb-8 text-[#5C4033]/60 hover:text-[#2F5233] flex items-center gap-2 transition-colors font-medium"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Cart
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm h-fit border border-[#2F5233]/5">
          <h2 className="text-2xl font-serif font-bold text-[#2F5233] mb-6 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            Order Summary
          </h2>
          
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 no-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-[#F5F5F0] last:border-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-bold text-[#2F5233]">{item.name}</h3>
                  <p className="text-sm text-[#5C4033]/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-[#2F5233]">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F5F5F0] pt-6">
            <div className="flex justify-between items-center text-xl font-bold text-[#2F5233]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-serif font-bold text-[#2F5233] mb-2">Checkout</h2>
          <p className="text-[#5C4033]/60 mb-8">Please enter your details to complete your order.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2">Full Name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-2xl border border-[#2F5233]/10 focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/10 outline-none transition-all"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-2">Email</label>
                <input
                  type="email" required
                  className="w-full px-4 py-3 rounded-2xl border border-[#2F5233]/10 focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/10 outline-none transition-all"
                  value={formData.customerEmail}
                  onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C4033] mb-2">Phone</label>
                <input
                  type="tel" required
                  className="w-full px-4 py-3 rounded-2xl border border-[#2F5233]/10 focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/10 outline-none transition-all"
                  value={formData.customerPhone}
                  onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                  placeholder="+20 123 456 7890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2">Delivery Address</label>
              <textarea
                required rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-[#2F5233]/10 focus:border-[#2F5233] focus:ring-2 focus:ring-[#2F5233]/10 outline-none transition-all resize-none"
                value={formData.customerAddress}
                onChange={e => setFormData({...formData, customerAddress: e.target.value})}
                placeholder="123 Green Street, Organic City..."
              />
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-[#2F5233] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#5C4033] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? 'Processing...' : <><CheckCircle size={20} /> Place Order</>}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
