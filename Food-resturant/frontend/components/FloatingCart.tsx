'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingCart() {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-[190] bg-[#E8B904] text-black w-14 h-14 rounded-full shadow-[0_0_20px_rgba(232,185,4,0.4)] hover:bg-[#CFA203] hover:scale-105 transition-all flex items-center justify-center pointer-events-auto"
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <div className="absolute top-2 right-2 bg-[#A31616] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-transparent">
              {cartItemsCount}
            </div>
          )}
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
