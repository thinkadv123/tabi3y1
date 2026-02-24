import React from 'react';
import { ArrowRight, Leaf, Bird, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <div className="relative h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Organic Farm" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2F5233]/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-[#F4E285] text-[#2F5233] px-4 py-1 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">
              100% Organic & Fresh
            </span>
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Pure Nature <br /> 
              <span className="text-[#F4E285]">Delivered</span> to You
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Experience the true taste of Egypt's fertile lands. From chemical-free vegetables 
              to pasture-raised poultry, we bring the farm's best to your table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onShopNow}
                className="bg-[#F4E285] text-[#2F5233] px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl"
              >
                Shop the Market <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white/30 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Our Story
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-md border-t border-white/10 py-8 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-[#F4E285] p-3 rounded-xl text-[#2F5233]">
              <Leaf size={24} />
            </div>
            <div>
              <h4 className="font-bold">Chemical Free</h4>
              <p className="text-sm text-white/60">No pesticides or synthetic fertilizers</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="bg-[#F4E285] p-3 rounded-xl text-[#2F5233]">
              <Bird size={24} />
            </div>
            <div>
              <h4 className="font-bold">Free Range</h4>
              <p className="text-sm text-white/60">Pasture-raised healthy poultry</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="bg-[#F4E285] p-3 rounded-xl text-[#2F5233]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold">Certified Organic</h4>
              <p className="text-sm text-white/60">Strict quality standards guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
