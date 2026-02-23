import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#2F5233] text-[#F5F5F0] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[#F4E285]">Tabi3y</h3>
            <p className="text-[#F5F5F0]/70 text-sm leading-relaxed">
              Bringing the freshest organic vegetables and free-range poultry directly from local farms to your table. Sustainable, healthy, and delicious.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-[#F4E285] hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-[#F4E285] hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-[#F4E285] hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-[#B1D8B7]">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[#F5F5F0]/80">
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Shop All</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Recipes</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-[#B1D8B7]">Categories</h4>
            <ul className="space-y-3 text-sm text-[#F5F5F0]/80">
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Fresh Vegetables</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Free-Range Poultry</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Organic Fruits</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Dairy & Eggs</a></li>
              <li><a href="#" className="hover:text-[#F4E285] transition-colors">Pantry Essentials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-[#B1D8B7]">Contact Us</h4>
            <ul className="space-y-4 text-sm text-[#F5F5F0]/80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F4E285] mt-1 flex-shrink-0" />
                <span>123 Green Valley Road,<br />Eco City, EC 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#F4E285] flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#F4E285] flex-shrink-0" />
                <span>hello@tabi3y.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#F5F5F0]/10 mt-12 pt-8 text-center text-xs text-[#F5F5F0]/40 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} Tabi3y Organic Market. All rights reserved.</span>
          <a href="/admin" className="hover:text-[#F4E285] transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
