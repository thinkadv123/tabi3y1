import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-[#F5F5F0] rounded-full flex items-center justify-center mb-6 text-[#2F5233]/20">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2F5233] mb-2">Your Cart is Empty</h2>
        <p className="text-[#5C4033]/70 mb-8 max-w-md">
          Looks like you haven't added any fresh produce yet. Start shopping to fill your basket with nature's best.
        </p>
        <button 
          onClick={() => window.location.href = '/'} // Simple redirect or state change handled by parent
          className="bg-[#2F5233] text-white px-8 py-3 rounded-full font-bold hover:bg-[#5C4033] transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-serif font-bold text-[#2F5233] mb-8">Your Basket</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-6 bg-white p-6 rounded-2xl border border-[#2F5233]/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F5F5F0] flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#2F5233]">{item.name}</h3>
                      <p className="text-sm text-[#5C4033]/60">{item.unit}</p>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-[#5C4033]/40 hover:text-rose-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 bg-[#F5F5F0] rounded-full px-4 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-[#2F5233] hover:bg-white rounded-full transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-[#2F5233] w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#2F5233] hover:bg-white rounded-full transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-lg text-[#2F5233]">
                      EGP {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#F5F5F0] p-8 rounded-2xl sticky top-24 border border-[#2F5233]/10">
            <h3 className="font-serif font-bold text-2xl text-[#2F5233] mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[#5C4033]">
                <span>Subtotal</span>
                <span className="font-bold">EGP {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5C4033]">
                <span>Shipping</span>
                <span className="text-[#2F5233] font-bold">Free</span>
              </div>
              <div className="flex justify-between text-[#5C4033]">
                <span>Tax (Estimated)</span>
                <span className="font-bold">EGP {(total * 0.14).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#2F5233]/10 pt-4 flex justify-between text-xl font-bold text-[#2F5233]">
                <span>Total</span>
                <span>EGP {(total * 1.14).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-[#2F5233] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#5C4033] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              Checkout Securely
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-xs text-center text-[#5C4033]/50 mt-4">
              Secure payments powered by Stripe. 100% Money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
