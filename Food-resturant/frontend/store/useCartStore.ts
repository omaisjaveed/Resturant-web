import { create } from 'zustand';

export interface CartItemOption {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  options: CartItemOption[];
  specialInstructions?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  addItemSilent: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isCartOpen: false,
  addItem: (item) => set((state) => {
    // Basic logic to group identical items could go here, but for now we'll just add as new line item to keep it simple with options
    return { 
      items: [...state.items, { ...item, id: crypto.randomUUID() }],
      isCartOpen: true // Open cart when item added
    }
  }),
  addItemSilent: (item) => set((state) => ({
    items: [...state.items, { ...item, id: crypto.randomUUID() }]
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
  })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearCart: () => set({ items: [] }),
}));
