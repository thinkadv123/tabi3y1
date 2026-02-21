import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <div className="relative h-[600px] overflow-hidden bg-[#2F5233]">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
          alt="Organic Vegetables" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2F5233]/90 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <span className="inline-block px-4 py-1 bg-[#F4E285] text-[#2F5233] font-bold text-sm tracking-wider rounded-full mb-6">
            100% ORGANIC & FRESH
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Nature's Best, <br />
            <span className="text-[#B1D8B7]">Delivered to You.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#F5F5F0]/90 mb-8 max-w-lg leading-relaxed">
            Experience the true taste of organic vegetables and free-range poultry. Sustainably sourced from local farms.
          </p>
          <button 
            onClick={onShopNow}
            className="group bg-[#F5F5F0] text-[#2F5233] px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-[#F4E285] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shop Now
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
