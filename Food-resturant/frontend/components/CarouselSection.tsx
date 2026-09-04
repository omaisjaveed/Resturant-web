'use client';
import { motion } from 'motion/react';

export default function CarouselSection() {
  return (
    <section className="py-24 bg-transparent text-[#E8B904]">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-sans font-bold tracking-tight mb-16 text-center text-[#E8B904]">
          Featured Delights
        </h2>
        <div className="flex space-x-8 overflow-x-auto pb-8 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="min-w-[320px] h-[450px] bg-neutral-900 rounded-2xl flex flex-col items-center justify-center p-8 border border-[#E8B904]/20 shadow-2xl"
            >
              <div className="w-full h-2/3 bg-neutral-800 rounded-xl mb-6" />
              <h3 className="text-2xl font-sans font-medium">Signature Dish {i}</h3>
              <p className="text-[#E8B904]/70 mt-2">A culinary masterpiece.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
