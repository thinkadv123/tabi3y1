import React from 'react';
import { ShoppingLeaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2F5233] text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg">
                <ShoppingLeaf className="text-[#2F5233] w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">Tabi3y</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Bringing the freshest, chemical-free produce from our farm directly to your table. 
              Healthy living starts with healthy eating.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Shop Market</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Farm Visits</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Wholesale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-8">Categories</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Vegetables</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Poultry</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Fruits</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Dairy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-8">Contact Us</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-center gap-3"><Mail size={18} className="text-[#F4E285]" /> hello@tabi3y.com</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-[#F4E285]" /> +20 123 456 7890</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-[#F4E285]" /> Organic Road, Cairo, Egypt</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
          <p>© 2024 Tabi3y Organic Farm. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
