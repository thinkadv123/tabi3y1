import React from 'react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { motion } from 'motion/react';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm max-w-md mx-auto">
          <ShoppingBag size={64} className="mx-auto text-[#2F5233]/20 mb-6" />
          <h2 className="text-3xl font-serif font-bold text-[#2F5233] mb-4">Your cart is empty</h2>
          <p className="text-[#5C4033]/60 mb-8">Looks like you haven't added any fresh produce yet.</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-[#2F5233] text-white px-8 py-3 rounded-full font-bold hover:bg-[#5C4033] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-serif font-bold text-[#2F5233] mb-12">Shopping Cart</h2>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-6 border border-[#2F5233]/5"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-2xl"
              />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-serif font-bold text-[#2F5233]">{item.name}</h3>
                <p className="text-[#5C4033]/60 text-sm">Per {item.unit}</p>
              </div>
              <div className="flex items-center gap-4 bg-[#F5F5F0] p-2 rounded-2xl">
                <button 
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="p-1 hover:text-[#2F5233] transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="p-1 hover:text-[#2F5233] transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-[#2F5233]">${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-rose-500 hover:text-rose-700 transition-colors mt-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#2F5233]/5 sticky top-24">
            <h3 className="text-2xl font-serif font-bold text-[#2F5233] mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[#5C4033]/60">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5C4033]/60">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="h-px bg-[#F5F5F0]" />
              <div className="flex justify-between text-xl font-bold text-[#2F5233]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-[#2F5233] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#5C4033] transition-all shadow-lg"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
            <p className="text-center text-[10px] text-[#5C4033]/40 mt-4 uppercase tracking-widest font-bold">
              Secure Checkout Powered by Tabi3y
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
