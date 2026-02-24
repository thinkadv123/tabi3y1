import React from 'react';
import { PageContent } from '../types';
import { motion } from 'motion/react';
import { Leaf, Bird, Home } from 'lucide-react';

interface AboutProps {
  content: PageContent;
}

const iconMap: Record<string, any> = {
  Leaf: Leaf,
  Bird: Bird,
  Home: Home
};

export default function About({ content }: AboutProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2F5233] font-bold tracking-widest uppercase text-sm">Our Philosophy</span>
            <h2 className="text-5xl font-serif font-bold text-[#2F5233] mt-2 mb-6">{content.title}</h2>
            <p className="text-lg text-[#5C4033]/70 leading-relaxed mb-8">
              {content.content}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.sections?.map((section, idx) => {
                const Icon = iconMap[section.icon || 'Leaf'] || Leaf;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-[#F4E285] p-3 rounded-xl h-fit text-[#2F5233]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2F5233]">{section.title}</h4>
                      <p className="text-sm text-[#5C4033]/60">{section.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#F4E285] rounded-3xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#2F5233] rounded-3xl -z-10" />
            <img 
              src={content.image} 
              alt="Farm Life" 
              className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
