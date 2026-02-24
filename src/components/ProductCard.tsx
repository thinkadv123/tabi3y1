import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#2F5233]/5 group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#2F5233]">
            {product.category}
          </span>
        </div>
        <button 
          onClick={() => onAdd(product)}
          className="absolute bottom-4 right-4 bg-[#2F5233] text-white p-3 rounded-2xl shadow-lg translate-y-20 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#5C4033]"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-[#2F5233]">{product.name}</h3>
          <span className="text-lg font-bold text-[#2F5233]">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-[#5C4033]/60 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[#5C4033]/40 uppercase tracking-widest">Per {product.unit}</span>
          <button 
            onClick={() => onAdd(product)}
            className="text-[#2F5233] font-bold text-sm flex items-center gap-1 hover:underline"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
