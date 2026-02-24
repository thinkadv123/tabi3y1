import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-[#F5F5F0] min-h-[60vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border-4 border-[#2F5233]/5 relative z-10">
            <ShoppingBag size={64} className="text-[#2F5233]/40" />
          </div>
          <div className="absolute -top-4 -right-4 text-[#F4E285] animate-bounce">
            <Leaf size={48} fill="currentColor" />
          </div>
        </motion.div>
        
        <h2 className="text-4xl font-serif font-bold text-[#2F5233] mb-4">Your Basket is Empty</h2>
        <p className="text-[#5C4033]/70 mb-10 max-w-md text-lg leading-relaxed">
          The fields are full of fresh produce waiting for you. 
          <br/>Start filling your basket with nature's goodness.
        </p>
        
        <button 
          onClick={() => window.location.href = '/'} 
          className="bg-[#2F5233] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#5C4033] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 group"
        >
          Start Shopping <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end gap-4 mb-12 border-b border-[#2F5233]/10 pb-6">
          <h2 className="text-5xl font-serif font-bold text-[#2F5233]">Your Harvest</h2>
          <span className="text-xl text-[#5C4033]/60 font-serif italic mb-2">{items.length} items collected</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl p-4 pr-12 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-[#2F5233]/10 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4E285]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                  
                  <div className="flex gap-6 items-center relative z-10">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#F5F5F0] shadow-inner flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-1">
                        <h3 className="font-serif font-bold text-2xl text-[#2F5233] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#5C4033]/60 font-medium uppercase tracking-wider">{item.unit}</p>
                      </div>

                      <div className="flex items-center gap-3 bg-[#F5F5F0] rounded-full px-2 py-2 w-fit">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white text-[#2F5233] rounded-full shadow-sm hover:bg-[#2F5233] hover:text-white transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-[#2F5233] w-8 text-center text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white text-[#2F5233] rounded-full shadow-sm hover:bg-[#2F5233] hover:text-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="block text-2xl font-bold text-[#2F5233]">
                          EGP {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-xs text-[#5C4033]/40">
                          EGP {item.price.toFixed(2)} / unit
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onRemove(item.id)}
                      className="absolute top-4 right-4 text-[#5C4033]/20 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#2F5233] text-[#F5F5F0] p-8 rounded-3xl sticky top-24 shadow-xl relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4E285] rounded-full mix-blend-overlay opacity-10 blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F4E285] rounded-full mix-blend-overlay opacity-10 blur-2xl -ml-10 -mb-10" />

              <h3 className="font-serif font-bold text-3xl mb-8 relative z-10">Order Summary</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center text-[#F5F5F0]/80 text-lg">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">EGP {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[#F5F5F0]/80 text-lg">
                  <span>Shipping</span>
                  <span className="text-[#F4E285] font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center text-[#F5F5F0]/80 text-lg">
                  <span>Tax (14%)</span>
                  <span className="font-bold text-white">EGP {(total * 0.14).toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-white/20 my-6" />
                
                <div className="flex justify-between items-end mb-8">
                  <span className="text-xl font-medium text-[#F5F5F0]/80">Total</span>
                  <span className="text-4xl font-serif font-bold text-white">EGP {(total * 1.14).toFixed(2)}</span>
                </div>

                <button 
                  onClick={onCheckout}
                  className="w-full bg-[#F4E285] text-[#2F5233] py-5 rounded-2xl font-bold text-xl hover:bg-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group transform hover:-translate-y-1"
                >
                  Proceed to Checkout
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-[#F5F5F0]/40 mt-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4E285]" />
                  <span>Secure Encrypted Payment</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4E285]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
