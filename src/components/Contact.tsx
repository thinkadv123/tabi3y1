import React from 'react';
import { motion } from 'motion/react';
import { PageContent } from '../types';

interface ContactProps {
  content: PageContent & {
    email: string;
    phone: string;
    address: string;
  };
}

const Contact: React.FC<ContactProps> = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-20 max-w-5xl"
    >
      <h1 className="text-4xl font-serif font-bold text-[#2F5233] mb-8 text-center">{content.title}</h1>
      <p className="text-center text-[#5C4033]/80 mb-12 max-w-2xl mx-auto">{content.content}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#2F5233]/10">
          <h3 className="text-2xl font-serif font-bold text-[#2F5233] mb-6">Send us a Message</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 border border-[#2F5233]/20 rounded-xl focus:ring-2 focus:ring-[#2F5233] outline-none bg-[#F5F5F0]/50" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-[#2F5233]/20 rounded-xl focus:ring-2 focus:ring-[#2F5233] outline-none bg-[#F5F5F0]/50" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2">Message</label>
              <textarea className="w-full px-4 py-3 border border-[#2F5233]/20 rounded-xl focus:ring-2 focus:ring-[#2F5233] outline-none bg-[#F5F5F0]/50 h-32 resize-none" placeholder="How can we help?" />
            </div>
            <button className="w-full bg-[#2F5233] text-white font-bold py-4 rounded-xl hover:bg-[#5C4033] transition-colors shadow-lg">
              Send Message
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#2F5233] text-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-serif font-bold mb-6 text-[#F4E285]">Contact Info</h3>
            <div className="space-y-6">
              <div>
                <span className="block text-[#B1D8B7] text-sm font-bold uppercase tracking-wider mb-1">Email</span>
                <span className="text-lg">{content.email}</span>
              </div>
              <div>
                <span className="block text-[#B1D8B7] text-sm font-bold uppercase tracking-wider mb-1">Phone</span>
                <span className="text-lg">{content.phone}</span>
              </div>
              <div>
                <span className="block text-[#B1D8B7] text-sm font-bold uppercase tracking-wider mb-1">Address</span>
                <span className="text-lg">{content.address}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#F4E285] p-8 rounded-2xl shadow-lg text-[#2F5233]">
             <h3 className="text-xl font-bold mb-4">Visit Our Farm</h3>
             <p className="mb-4">We welcome visitors every Saturday for fresh picking and tours.</p>
             <div className="font-bold">Every Saturday: 9:00 AM - 2:00 PM</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
