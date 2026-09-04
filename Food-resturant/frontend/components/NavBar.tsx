'use client';

import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function NavBar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-8 lg:top-10 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100] flex items-center h-16 md:h-20"
    >
      {/* Background Pill */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md border border-[#E8B904]/40 rounded-full shadow-2xl pointer-events-none"></div>

      <div className="relative flex items-center justify-between w-full px-8 h-full pointer-events-auto">
        {/* Navigation Left */}
        <div className="hidden lg:flex flex-1 items-center justify-end pr-10 space-x-8 bg-transparent">
            <Link href="/" className="text-[#E8B904] font-black text-sm md:text-base uppercase tracking-wider hover:text-white transition-colors">Home</Link>
            <Link href="/menu" className="text-[#E8B904] font-bold text-sm md:text-base uppercase tracking-wider hover:text-white transition-colors">Menu</Link>
        </div>

        {/* Branding & Logo (Center) */}
        <div className="flex items-center justify-center relative flex-shrink-0 w-24 md:w-40 z-50 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-48 h-40 md:w-64 md:h-52 drop-shadow-2xl hover:scale-105 transition-transform origin-center pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/e354c3eb-42df-46b4-b563-ff35da75cc94.png"
                alt="Bongou Logo"
                className="w-full h-full object-contain object-center cursor-pointer drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Navigation Right */}
        <div className="hidden lg:flex flex-1 items-center justify-start pl-10 space-x-8 text-[#E8B904] font-sans text-sm md:text-base tracking-wider">
            <Link href="/about" className="font-semibold uppercase cursor-pointer hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="font-semibold uppercase cursor-pointer hover:text-white transition-colors">Contact Us</Link>
            <button onClick={toggleCart} className="relative cursor-pointer hover:text-white transition-colors p-2 md:p-3 bg-[#E8B904]/10 rounded-full flex items-center justify-center">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#A31616] text-white text-[10px] md:text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </div>
              )}
            </button>
        </div>
      </div>
    </motion.div>
  );
}

