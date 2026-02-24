import React from 'react';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  cartCount: number;
  view: ViewState;
  setView: (view: ViewState) => void;
}

export default function Header({ cartCount, view, setView }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', view: 'home' as ViewState },
    { label: 'Shop', view: 'shop' as ViewState },
    { label: 'About', view: 'about' as ViewState },
    { label: 'Contact', view: 'contact' as ViewState },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className="bg-[#2F5233] p-2 rounded-lg">
            <ShoppingLeaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-serif font-bold text-[#2F5233] tracking-tight">Tabi3y</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setView(item.view)}
              className={`text-sm font-medium transition-colors hover:text-[#2F5233] ${
                view === item.view ? 'text-[#2F5233] font-bold' : 'text-[#5C4033]/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('admin')}
            className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors text-[#5C4033]"
          >
            <User size={20} />
          </button>
          <button 
            onClick={() => setView('cart')}
            className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors relative text-[#5C4033]"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F4E285] text-[#2F5233] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#F5F5F0] p-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setView(item.view);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-[#5C4033] hover:bg-[#F5F5F0] rounded-lg"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// Mock icon since ShoppingLeaf isn't real in lucide
function ShoppingLeaf(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-8 8Z" />
      <path d="M7 21c-4.3-1.47-6-6.47-6-10" />
      <path d="M10.5 13C11.5 13.5 12.5 14 13.5 14.5" />
    </svg>
  );
}
