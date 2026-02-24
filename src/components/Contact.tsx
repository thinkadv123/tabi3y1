import React from 'react';
import { PageContent } from '../types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactProps {
  content: PageContent & {
    email: string;
    phone: string;
    address: string;
  };
}

export default function Contact({ content }: ContactProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-5xl font-serif font-bold text-[#2F5233] mb-4">{content.title}</h2>
          <p className="text-[#5C4033]/60 text-lg">{content.content}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#2F5233]/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#F4E285] p-3 rounded-xl text-[#2F5233]">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#2F5233]">Email Us</h4>
                  <p className="text-sm text-[#5C4033]/60">{content.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#F4E285] p-3 rounded-xl text-[#2F5233]">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#2F5233]">Call Us</h4>
                  <p className="text-sm text-[#5C4033]/60">{content.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#F4E285] p-3 rounded-xl text-[#2F5233]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#2F5233]">Visit Farm</h4>
                  <p className="text-sm text-[#5C4033]/60">{content.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form className="bg-white p-10 rounded-3xl shadow-sm border border-[#2F5233]/5 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5C4033]">Your Name</label>
                  <input type="text" className="w-full p-4 rounded-2xl border border-[#F5F5F0] bg-[#F5F5F0]/50 outline-none focus:ring-2 focus:ring-[#2F5233]/10" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5C4033]">Email Address</label>
                  <input type="email" className="w-full p-4 rounded-2xl border border-[#F5F5F0] bg-[#F5F5F0]/50 outline-none focus:ring-2 focus:ring-[#2F5233]/10" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#5C4033]">Message</label>
                <textarea rows={6} className="w-full p-4 rounded-2xl border border-[#F5F5F0] bg-[#F5F5F0]/50 outline-none focus:ring-2 focus:ring-[#2F5233]/10 resize-none" placeholder="Tell us what's on your mind..." />
              </div>
              <button className="w-full bg-[#2F5233] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#5C4033] transition-all shadow-lg">
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
