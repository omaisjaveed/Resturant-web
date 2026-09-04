'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce((acc, item) => {
    const itemTotal = item.basePrice + item.options.reduce((oAcc, o) => oAcc + o.price, 0);
    return acc + itemTotal * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-neutral-900 border-l border-[#E8B904]/20 z-[201] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8B904]/20">
              <h2 className="text-[#E8B904] font-black text-xl uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Order
              </h2>
              <button 
                onClick={toggleCart}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-white font-bold">{item.name}</h3>
                        <p className="text-[#E8B904] font-bold">
                          ${((item.basePrice + item.options.reduce((a, o) => a + o.price, 0)) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {item.options.length > 0 && (
                        <div className="text-sm text-white/50 mb-2">
                          {item.options.map((opt, idx) => (
                            <div key={idx}>+ {opt.name} (${opt.price.toFixed(2)})</div>
                          ))}
                        </div>
                      )}
                      
                      {item.specialInstructions && (
                        <p className="text-xs text-white/40 italic mb-2">Note: {item.specialInstructions}</p>
                      )}

                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center bg-black/50 rounded-full border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-[#E8B904] text-white/70 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-white text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-[#E8B904] text-white/70 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-300 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#E8B904]/20 bg-black/50">
                <div className="flex justify-between items-center mb-4 text-white">
                  <span className="font-medium text-white/70">Subtotal</span>
                  <span className="font-bold text-xl">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {/* <Link 
                    href="/checkout"
                    onClick={toggleCart}
                    className="w-full text-center block bg-[#E8B904] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#CFA203] transition-colors shadow-[0_0_15px_rgba(232,185,4,0.3)]"
                  >
                    Checkout ew
                  </Link> */}

                  <div className="w-full text-center block bg-[#E8B904] text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(232,185,4,0.3)]">
                    <p>For Order Contact</p>
                    <a href="tel:+344232427174" className="underline">
                      (302) 679-7174
                    </a>
                  </div>

                  <Link 
                    href="/menu" 
                    onClick={toggleCart}
                    className="w-full text-center text-white/70 hover:text-white text-sm font-medium transition-colors py-2"
                  >
                    Add more items
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
