import React from 'react';
import { motion } from 'motion/react';
import { PageContent } from '../types';

interface AboutProps {
  content: PageContent;
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-20 max-w-4xl text-center"
    >
      <h1 className="text-5xl font-serif font-bold text-[#2F5233] mb-8">{content.title}</h1>
      <p className="text-xl text-[#5C4033]/80 leading-relaxed mb-12 whitespace-pre-wrap">
        {content.content}
      </p>
      {content.image && (
        <img 
          src={content.image} 
          alt="About Us" 
          className="w-full h-[400px] object-cover rounded-3xl shadow-xl mb-12"
        />
      )}
      
      {content.sections && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {content.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-2xl font-serif font-bold text-[#2F5233] mb-4">{section.title}</h3>
              <p className="text-[#5C4033]/80">{section.content}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default About;
