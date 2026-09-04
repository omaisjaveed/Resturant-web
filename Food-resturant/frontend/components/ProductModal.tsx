'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '@/store/useCartStore';
import { X, Minus, Plus } from 'lucide-react';

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    price: string;
    image?: string;
  } | null;
}

const addOnsData = [
  { name: 'Extra Sauce', price: 0.50 },
  { name: 'Extra Rice', price: 2.00 },
  { name: 'Side of Plantains', price: 4.00 }
];

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<{name: string; price: number}[]>([]);

  if (!product) return null;

  const basePrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  
  const handleAddToOrder = () => {
    addItem({
      productId: product.name, // using name as id for mock
      name: product.name,
      basePrice,
      quantity,
      options: selectedOptions,
      specialInstructions: specialInstructions.trim() || undefined
    });
    // Reset state for next time
    setQuantity(1);
    setSpecialInstructions('');
    setSelectedOptions([]);
    onClose();
  };

  const handleOptionToggle = (option: {name: string, price: number}) => {
    setSelectedOptions(prev => 
      prev.find(o => o.name === option.name) 
        ? prev.filter(o => o.name !== option.name)
        : [...prev, option]
    );
  };

  const currentTotal = (basePrice + selectedOptions.reduce((acc, curr) => acc + curr.price, 0)) * quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6" style={{ pointerEvents: 'auto' }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-neutral-900 border border-[#E8B904]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header / Cover */}
            <div className={`${product.image ? 'h-64' : 'h-32'} bg-black/50 relative border-b border-[#E8B904]/20`}>
               {product.image && (
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
               )}
               <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-[#E8B904] hover:text-black text-white rounded-full transition-colors z-10 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
               <div className={`mb-8 relative z-10 ${product.image ? 'mt-4' : 'mt-[-40px]'}`}>
                 <h2 className="text-3xl font-black text-white tracking-tight">{product.name}</h2>
                 <p className="text-[#E8B904] font-black text-xl mb-2">{product.price}</p>
                 <p className="text-white/60 leading-relaxed text-sm lg:text-base">{product.description}</p>
               </div>

               {/* Add-ons */}
               <div className="mb-8">
                 <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 flex justify-between">
                   <span>Add-ons</span>
                   <span className="text-white/40 text-xs font-normal">Optional</span>
                 </h3>
                 <div className="space-y-3">
                   {addOnsData.map((addon) => {
                     const isSelected = selectedOptions.some(o => o.name === addon.name);
                     return (
                       <label 
                         key={addon.name} 
                         className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                           isSelected ? 'border-[#E8B904] bg-[#E8B904]/10' : 'border-white/10 bg-black/30 hover:border-white/30'
                         }`}
                       >
                         <div className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                             isSelected ? 'bg-[#E8B904] border-[#E8B904]' : 'border-white/30'
                           }`}>
                             {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                           </div>
                           <span className="text-white font-medium">{addon.name}</span>
                         </div>
                         <span className="text-white/60">+${addon.price.toFixed(2)}</span>
                          {/* Checkbox intentionally hidden visually but functional if we wanted to use actual input */}
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleOptionToggle(addon)} />
                       </label>
                     );
                   })}
                 </div>
               </div>

               {/* Special Instructions */}
               <div className="mb-4">
                  <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Special Instructions</h3>
                  <textarea 
                    rows={3} 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. No onions, extra crispy..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B904] transition-colors resize-none text-sm"
                  />
               </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-6 border-t border-[#E8B904]/20 bg-neutral-900/95 backdrop-blur-sm flex flex-col sm:flex-row gap-4 items-center">
               <div className="flex items-center bg-black/50 rounded-full border border-white/10 px-2 py-1 shrink-0">
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="p-3 hover:text-[#E8B904] text-white/70 transition-colors"
                 >
                   <Minus className="w-5 h-5" />
                 </button>
                 <span className="w-8 text-center text-white font-bold">{quantity}</span>
                 <button 
                   onClick={() => setQuantity(quantity + 1)}
                   className="p-3 hover:text-[#E8B904] text-white/70 transition-colors"
                 >
                   <Plus className="w-5 h-5" />
                 </button>
               </div>
               
               <button 
                 onClick={handleAddToOrder}
                 className="flex-1 w-full bg-[#E8B904] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#CFA203] transition-colors shadow-[0_0_15px_rgba(232,185,4,0.3)] flex justify-center items-center gap-2"
               >
                 <span>Add to Order</span>
                 <span className="text-black/50 px-1">•</span>
                 <span>${currentTotal.toFixed(2)}</span>
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
