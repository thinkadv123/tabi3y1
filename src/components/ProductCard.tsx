import React from 'react';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#2F5233]/5"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F5F5F0]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onAdd(product)}
            className="text-[#2F5233] hover:text-[#F4E285] transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 bg-[#2F5233] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-xl text-[#2F5233] leading-tight group-hover:text-[#5C4033] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-[#F4E285]">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold text-[#5C4033]">4.8</span>
          </div>
        </div>
        
        <p className="text-[#5C4033]/70 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[#2F5233]/10">
          <div className="flex flex-col">
            <span className="text-xs text-[#5C4033]/50 uppercase font-bold tracking-wider">Price</span>
            <span className="text-lg font-bold text-[#2F5233]">
              EGP {product.price.toFixed(2)}
              <span className="text-xs font-normal text-[#5C4033]/50 ml-1">/{product.unit}</span>
            </span>
          </div>
          
          <button
            onClick={() => onAdd(product)}
            className="bg-[#F5F5F0] hover:bg-[#2F5233] hover:text-white text-[#2F5233] px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 group/btn"
          >
            Add to Cart
            <ShoppingBag size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
