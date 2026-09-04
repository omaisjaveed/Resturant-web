'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Clock, Search } from 'lucide-react';
import { homePageAPI } from '@/lib/api';

export default function Hero() {
  const router = useRouter();
  const defaultHeroTitle = 'BONGOU';
  const defaultHeroSubtitle = 'A unique dining experience that brings 2 cultures together.';
  const [searchQuery, setSearchQuery] = useState('');
  const [heroTitle, setHeroTitle] = useState(defaultHeroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(defaultHeroSubtitle);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        const data = await homePageAPI.getAll();
        setHeroTitle(data.content?.hero_title?.value || defaultHeroTitle);
        setHeroSubtitle(data.content?.hero_subtitle?.value || defaultHeroSubtitle);
      } catch (error) {
        console.error('Home page content load error:', error);
      }
    };

    fetchHomePageContent();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/menu');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-transparent overflow-hidden pt-20">
      {/* Background Image Grid */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <div className="grid grid-cols-3 grid-rows-2 w-full h-full opacity-40 gap-1 scale-105">
          {[
            "https://i.ibb.co/VWp5nBYC/Catfish-Dinner-your-choice-of-rice-and-2-sides.jpg",
            "https://i.ibb.co/6Rhj03K3/Bongou-Cheddar-Burger-n-Frys.jpg",
            "https://i.ibb.co/PzThQvkr/Wing-dinner-w-2-sides.jpg",
            "https://i.ibb.co/qMcg2Y9K/Grilled-Lamb-Chops-with-your-choice-of-rice-and-2-sides.jpg",
            "https://i.ibb.co/7dyZ4xY2/Just-Catfish.jpg",
            "https://i.ibb.co/Cp4ZvDM6/baked-chicken-Dinner-W-your-choice-of-rice-and-2-sides.jpg"
          ].map((src, i) => (
            <div key={i} className="relative w-full h-full overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  x: [0, i % 2 === 0 ? 15 : -15, 0],
                  y: [0, i % 3 === 0 ? 15 : -15, 0]
                }}
                transition={{
                  duration: 5 + i * 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-full h-full"
              >
                <Image src={src} alt={`Background ${i + 1}`} fill className="object-cover" priority referrerPolicy="no-referrer" />
              </motion.div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E8B904]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#E8B904]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Left: Main Heading */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="font-black leading-[0.8] tracking-[-0.05em] animate-flow bg-[length:200%_auto] bg-gradient-to-r from-[#A31616] via-[#E8B904] to-[#A31616] bg-clip-text text-transparent relative group"
          >
            <span className="block text-[60px] md:text-[100px] lg:text-[150px]">BONGOU</span>
            <span className="block text-[30px] md:text-[60px] lg:text-[80px] mt-2">SOUL FOOD</span>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '30%' }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-[#A31616] via-[#E8B904] to-[#A31616] bg-[length:200%_auto] animate-flow rounded-full"
            />
          </motion.h1>

          <div className="mt-8 lg:mt-12 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col space-y-6"
            >
              <motion.p 
                className="text-[#E8B904] italic text-2xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {heroTitle}
              </motion.p>
              
              <p className="text-[#E8B904]/80 text-xl leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Modern Dark Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="w-full max-w-xl pr-2"
              >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center group w-full">
                  <div className="absolute left-5 text-white/40 group-focus-within:text-[#E8B904] transition-colors pointer-events-none">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants or dishes..."
                    className="w-full bg-[#121212]/70 backdrop-blur-md border border-[#E8B904]/20 focus:border-[#E8B904] text-white placeholder-white/40 font-medium pl-14 pr-32 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-[#E8B904]/10 transition-all text-sm sm:text-base cursor-text shadow-2xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 px-6 py-2.5 bg-[#E8B904] hover:bg-[#CFA203] active:scale-95 text-black rounded-xl font-black text-xs uppercase tracking-wider transition-all"
                  >
                    Search
                  </button>
                </form>
              </motion.div>

              <div className="pt-2">
                <motion.button
                  onClick={() => router.push('/menu')}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(197, 160, 89, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-[#E8B904] text-black rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all"
                >
                  Order Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
