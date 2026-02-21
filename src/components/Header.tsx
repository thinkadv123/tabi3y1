import React from 'react';
import { ShoppingBag, Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState } from '../types';

interface HeaderProps {
  cartCount: number;
  view: ViewState;
  setView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, view, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Shop', value: 'shop' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F5F5F0]/80 backdrop-blur-md border-b border-[#2F5233]/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className="w-10 h-10 bg-[#2F5233] rounded-full flex items-center justify-center text-[#F4E285]">
            <Leaf size={20} />
          </div>
          <span className="text-2xl font-serif font-bold text-[#2F5233]">Tabi3y</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setView(item.value as ViewState)}
              className={`text-sm font-medium tracking-wide transition-colors ${
                view === item.value 
                  ? 'text-[#2F5233] font-bold' 
                  : 'text-[#5C4033] hover:text-[#2F5233]'
              }`}
            >
              {item.label.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('cart')}
            className="relative p-2 text-[#5C4033] hover:text-[#2F5233] transition-colors"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-[#F4E285] text-[#2F5233] text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            className="md:hidden p-2 text-[#5C4033]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#F5F5F0] border-b border-[#2F5233]/10 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setView(item.value as ViewState);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left py-2 px-4 rounded-lg ${
                    view === item.value 
                      ? 'bg-[#2F5233]/10 text-[#2F5233] font-bold' 
                      : 'text-[#5C4033]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
