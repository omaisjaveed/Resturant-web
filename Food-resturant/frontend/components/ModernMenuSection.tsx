'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import ProductModal from './ProductModal';
import { Search, X, ChevronDown, FolderTree, Layers } from 'lucide-react';
import { productAPI, categoryAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getFullImageUrl = (url: string | undefined) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

// Fallback menu data to preserve exact UI
const fallbackMenuData = [
  {
    category: "Entrees",
    items: [
      { name: "Soul Fried Chicken", tags: ["Popular"], description: "3pc (+$1 All White) (+$2.50 All Wings 4pc)", price: "$16.00" },
      { name: "Soul Baked Chicken", tags: [], description: "Dinner W/ your choice of rice and 2 sides", price: "$16.00", image: "https://i.ibb.co/Cp4ZvDM6/baked-chicken-Dinner-W-your-choice-of-rice-and-2-sides.jpg" },
      { name: "Red Snapper", tags: ["Seafood"], description: "Southern or Creole style.", price: "$32.00" },
      { name: "Catfish Dinner", tags: ["Seafood", "Popular"], description: "With your choice of rice and 2 sides", price: "$18.00", image: "https://i.ibb.co/VWp5nBYC/Catfish-Dinner-your-choice-of-rice-and-2-sides.jpg" },
      { name: "Wing Dinner", tags: ["Popular"], description: "With 2 sides", price: "$16.00", image: "https://i.ibb.co/PzThQvkr/Wing-dinner-w-2-sides.jpg" },
      { name: "Soul Smothered Turkey Wings", tags: [], description: "Tender and flavorful", price: "$16.00" },
      { name: "Grilled Lamb Chops", tags: [], description: "With your choice of rice and 2 sides", price: "$28.00", image: "https://i.ibb.co/qMcg2Y9K/Grilled-Lamb-Chops-with-your-choice-of-rice-and-2-sides.jpg" },
      { name: "Oxtail Pasta bowl", tags: [], description: "Rich and savory", price: "$18.00" },
      { name: "Haitian Griot (fried pork)", tags: ["Authentic"], description: "Classic Haitian dish", price: "$18.00" },
      { name: "Haitian Oxtail (Ke bef)", tags: [], description: "Rich and savory oxtail stew", price: "$28.00" },
      { name: "Haitian Chicken stewed", tags: [], description: "( Poule nan sauce) 3pc (+$1 All White)", price: "$16.00" },
      { name: "Haitian Fried Turkey", tags: [], description: "(Kodenn fri)", price: "$16.00" },
      { name: "Haitian Legume", tags: ["Veg Option"], description: "Hearty vegetable stew", price: "$18.00" }
    ]
  },
  {
    category: "Sides (8oz)",
    items: [
      { name: "White Rice", tags: ["Vegan"], description: "(Diri blan)", price: "$4.00", image: "https://i.ibb.co/JRh2jmT6/White-Rice.jpg" },
      { name: "Black Rice", tags: ["Popular"], description: "(Diri a djon djon)", price: "$5.00", image: "https://i.ibb.co/3m3Cn5SH/Creole-Black-rice.jpg" },
      { name: "Rice & Peas", tags: ["Veg"], description: "(Diri a pois)", price: "$5.00", image: "https://i.ibb.co/3YpYPnnH/Creole-Red-beans-and-rice.jpg" },
      { name: "Mac and Cheese", tags: ["Veg", "Popular"], description: "Creamy and cheesy", price: "$6.50", image: "https://i.ibb.co/S7K6kt4m/Southern-Cheesy-Baked-Mac-n-Cheese.jpg" },
      { name: "Collard Greens", tags: [], description: "Slow-cooked classic", price: "$5.00", image: "https://i.ibb.co/cSSg8hKM/Southern-Collard-Greens.jpg" },
      { name: "Green Beans", tags: ["Veg"], description: "Fresh and flavorful", price: "$5.00", image: "https://i.ibb.co/xtyFpMMQ/Southern-Green-Beans.jpg" },
      { name: "Yams", tags: ["Veg"], description: "Sweet and tender", price: "$5.00", image: "https://i.ibb.co/rRjhbdzv/Southern-Yams.jpg" },
      { name: "Honey Blueberry Cornbread", tags: ["Veg"], description: "Sweet and savory", price: "$4.00", image: "https://i.ibb.co/qYwp9RJ3/Bongou-Honey-Blueberry-Cornbread.jpg" },
      { name: "Plantain 'Banane Peze'", tags: ["Veg"], description: "6 pieces served with Pikliz", price: "$4.00" },
      { name: "Side Salad", tags: ["Veg"], description: "Salad russe", price: "$4.00" },
      { name: "Fries", tags: ["Veg"], description: "Crispy and golden", price: "$4.00" }
    ]
  },
  {
    category: "Specialties",
    items: [
      { name: "Hamburgers (Grilled Beef)", tags: [], description: "Topped with Cheddar Cheese, Mayo, Ketchup, Lettuce Tomato, Pickles & Onions and served with a side of fries", price: "$11.00", image: "https://i.ibb.co/8nSYtjqh/Bongou-Grilled-beef-burger-and-Frys.jpg" },
      { name: "Bongou Cheddar Burger", tags: [], description: "Classic cheddar burger with fries", price: "$11.00", image: "https://i.ibb.co/6Rhj03K3/Bongou-Cheddar-Burger-n-Frys.jpg" },
      { name: "Grilled Cheese", tags: ["Veg"], description: "With melted cheddar and served with a side of fries", price: "$8.00", image: "https://i.ibb.co/TMKfyTdY/Grilled-Cheese-n-Frys.jpg" },
      { name: "Just Catfish", tags: ["Seafood"], description: "Fried perfectly", price: "$14.00", image: "https://i.ibb.co/7dyZ4xY2/Just-Catfish.jpg" },
      { name: "Just Wings", tags: [], description: "Delicious crispy wings", price: "$12.00", image: "https://i.ibb.co/NfwLHRc/Just-Wings.jpg" },
      { name: "Wings and Fries", tags: ["Popular"], description: "Classic combo", price: "$14.00", image: "https://i.ibb.co/hFp48Hz2/Wings-and-fries.jpg" },
      { name: "Chicken Tenders", tags: [], description: "3 Tenders served with fries and a side of dipping sauce", price: "$10.00" },
      { name: "Haitian Pattie", tags: ["Popular"], description: "'Beef, Chicken, Fish' (w/ fries $6)", price: "$4.00" }
    ]
  },
  {
    category: "Desserts & Drinks",
    items: [
      { name: "Pound Cake", tags: ["Veg"], description: "Moist and flavorful, our pound cake is made with love and a hint of vanilla", price: "$8.00" },
      { name: "Chocolate Cake", tags: ["Veg"], description: "Rich and decadent, our chocolate cake is a chocolate lover's dream", price: "$8.00" },
      { name: "Sweet Potato Pie", tags: ["Veg"], description: "A Southern classic, our sweet potato pie is made with love and a hint of spice", price: "$6.00" },
      { name: "Fountain Drinks", tags: [], description: "M 21oz ($2.95) / L 32oz ($3.25)", price: "$2.95+" },
      { name: "Frozen Lemonade", tags: [], description: "M 21oz", price: "$4.55" },
      { name: "Haitian Soda / Bottled", tags: [], description: "Refreshing options", price: "$3.30" }
    ]
  }
];

interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  image: string | null;
  children: CategoryTree[];
}

interface MenuItem {
  name: string;
  tags: string[];
  description: string;
  price: string;
  image?: string;
}

export default function ModernMenuSection() {
  const router = useRouter();
  const pathname = usePathname();
  
  // API data state
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  // UI state
  const [selectedProduct, setSelectedProduct] = useState<{name: string, description: string, price: string, image?: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'fallback'>('fallback');
  
  // Expanded parent categories (track which ones are open)
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());
  
  // Active selection: { type: 'parent' | 'child', id: number, name: string }
  const [activeSelection, setActiveSelection] = useState<{ type: 'parent' | 'child'; id: number; name: string } | null>(null);

  const fetchMenuData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching menu data from API...');
      const [productsData, treeData] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getTree()
      ]);

      console.log('Products from API:', productsData.products?.length);
      console.log('Category tree from API:', treeData.categories?.length);

      if (treeData.categories && treeData.categories.length > 0) {
        setCategoryTree(treeData.categories);
        setAllProducts(productsData.products || []);
        
        // Auto-expand first parent
        const firstParent = treeData.categories[0];
        setExpandedParents(new Set([firstParent.id]));
        setActiveSelection({ type: 'parent', id: firstParent.id, name: firstParent.name });
        
        setDataSource('api');
      } else {
        console.log('No categories from API, using fallback');
        setDataSource('fallback');
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
      console.log('Using fallback menu data due to error');
      setDataSource('fallback');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Refetch when pathname changes (navigation back to menu)
  useEffect(() => {
    if (pathname === '/menu' || pathname === '/') {
      console.log('Menu page visible, refetching data...');
      fetchMenuData();
    }
  }, [pathname, fetchMenuData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search') || '';
      if (q) {
        const timer = setTimeout(() => {
          setSearchQuery(q);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Toggle parent expand/collapse
  const toggleParent = (parentId: number) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  // Select a category (parent or child) and show its products
  const selectCategory = (type: 'parent' | 'child', id: number, name: string) => {
    setSearchQuery('');
    setActiveSelection({ type, id, name });
  };

  // Compute the products to display for the current selection
  const displayedItems = useMemo((): MenuItem[] => {
    if (dataSource === 'fallback') return [];
    if (!activeSelection) return [];

    let filteredProducts: any[];

    if (activeSelection.type === 'parent') {
      // Get all children IDs of this parent
      const parent = categoryTree.find(c => c.id === activeSelection.id);
      if (!parent) return [];
      const childIds = (parent.children || []).map(c => c.id);
      const allCategoryIds = [activeSelection.id, ...childIds];
      filteredProducts = allProducts.filter(p => allCategoryIds.includes(p.category_id));
    } else {
      // Just this child category
      filteredProducts = allProducts.filter(p => p.category_id === activeSelection.id);
    }

    return filteredProducts.map(p => ({
      name: p.name,
      tags: p.featured ? ["Popular"] : [],
      description: p.description || "",
      price: `$${Number(p.price).toFixed(2)}`,
      image: getFullImageUrl((p as any).image_url)
    }));
  }, [activeSelection, categoryTree, allProducts, dataSource]);

  // Search results across ALL products
  const filteredSearchItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const sourceProducts = dataSource === 'api' 
      ? allProducts.map(p => ({
          name: p.name,
          tags: p.featured ? ["Popular"] : [],
          description: p.description || "",
          price: `$${Number(p.price).toFixed(2)}`,
          image: getFullImageUrl((p as any).image_url)
        }))
      : fallbackMenuData.flatMap(cat => cat.items);
    
    return sourceProducts.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, allProducts, dataSource]);

  // Get current display title
  const currentTitle = useMemo(() => {
    if (searchQuery.trim()) return `Search Results: ${filteredSearchItems.length} ${filteredSearchItems.length === 1 ? 'item' : 'items'} found`;
    if (activeSelection) return activeSelection.name;
    return 'Menu';
  }, [searchQuery, filteredSearchItems, activeSelection]);

  return (
    <section className="py-24 bg-transparent min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#E8B904] font-serif italic text-xl mb-4"
          >
            A Taste of Excellence
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-black text-white uppercase tracking-tighter mb-6"
          >
            The Menu
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="h-1 bg-[#E8B904] mx-auto rounded-full"
          />
        </div>

        {/* Sleek Sub-Header Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 px-4">
          <div className="relative flex items-center group w-full">
            <div className="absolute left-5 text-white/40 group-focus-within:text-[#E8B904] transition-colors pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes, sides or drinks..."
              className="w-full bg-neutral-900/60 backdrop-blur-md border border-white/10 focus:border-[#E8B904]/80 text-white placeholder-white/30 font-medium pl-14 pr-12 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#E8B904]/10 transition-all text-sm md:text-base cursor-text shadow-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-5 text-white/40 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Sticky Sidebar - Category Tree */}
          <div className="lg:w-1/4 lg:sticky lg:top-32 w-full">
            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[70vh] p-4 rounded-3xl bg-[#A31616]/20 border border-[#A31616]/30">
              
              {/* Show fallback categories if API failed */}
              {dataSource === 'fallback' && fallbackMenuData.map((section) => (
                <button
                  key={section.category}
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className={`
                    w-full text-left px-5 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all
                    ${!searchQuery && activeSelection?.name === section.category
                      ? "bg-[#E8B904] text-black shadow-[0_0_20px_rgba(232,185,4,0.3)]" 
                      : "bg-transparent text-white/50 hover:bg-[#A31616]/40 hover:text-white"
                    }
                  `}
                >
                  {section.category}
                </button>
              ))}

              {/* API category tree with expand/collapse */}
              {dataSource === 'api' && categoryTree.map((parent) => {
                const isExpanded = expandedParents.has(parent.id);
                const hasChildren = parent.children && parent.children.length > 0;
                const isParentActive = activeSelection?.type === 'parent' && activeSelection.id === parent.id;

                return (
                  <div key={parent.id}>
                    {/* Parent Category Button */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleParent(parent.id);
                        }
                        selectCategory('parent', parent.id, parent.name);
                      }}
                      className={`
                        w-full flex items-center justify-between text-left px-5 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all group
                        ${isParentActive && !searchQuery
                          ? "bg-[#E8B904] text-black shadow-[0_0_20px_rgba(232,185,4,0.3)]" 
                          : "bg-transparent text-white/50 hover:bg-[#A31616]/40 hover:text-white"
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <FolderTree className={`w-4 h-4 ${isParentActive && !searchQuery ? 'text-black' : 'text-[#E8B904]/60'}`} />
                        {parent.name}
                      </span>
                      {hasChildren && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isParentActive && !searchQuery ? 'text-black' : 'text-white/30'}`}
                        />
                      )}
                    </button>

                    {/* Children (subcategories) dropdown */}
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 pl-4 border-l-2 border-[#E8B904]/20 py-1 space-y-1">
                            {parent.children!.map((child) => {
                              const isChildActive = activeSelection?.type === 'child' && activeSelection.id === child.id;
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => selectCategory('child', child.id, child.name)}
                                  className={`
                                    w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all
                                    ${isChildActive && !searchQuery
                                      ? "bg-[#E8B904]/20 text-[#E8B904] border border-[#E8B904]/30" 
                                      : "text-white/40 hover:text-white hover:bg-white/5"
                                    }
                                  `}
                                >
                                  <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{child.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {dataSource === 'api' && categoryTree.length === 0 && (
                <p className="text-white/30 text-sm text-center py-8">No categories found</p>
              )}
            </nav>
            
            <div className="hidden lg:block mt-12 p-8 rounded-3xl bg-[#E8B904] text-black shadow-[0_0_20px_rgba(232,185,4,0.3)]">
              <h4 className="text-black font-black uppercase tracking-wider mb-2 text-sm">Note</h4>
              <p className="text-black/80 font-medium text-sm leading-relaxed">
                Please inform your server of any food allergies or dietary restrictions. Consuming raw or undercooked meats may increase your risk of foodborne illness.
              </p>
            </div>
          </div>

          {/* Right Side - Menu Items */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-[#E8B904] text-xl">Loading menu...</div>
              </div>
            ) : searchQuery.trim() ? (
              <div>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-3xl lg:text-4xl font-sans font-black text-white uppercase tracking-tight">
                    {currentTitle}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#E8B904]/50 to-transparent" />
                </div>

                {filteredSearchItems.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-900/30 border border-white/5 rounded-3xl">
                    <p className="text-white/50 text-lg mb-6">No dishes found matching &ldquo;{searchQuery}&rdquo;</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 bg-[#E8B904] text-black font-black uppercase tracking-wider rounded-xl text-xs hover:bg-[#CFA203] transition-colors shadow-lg"
                    >
                      View All Menu
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    {filteredSearchItems.map((item, idx) => (
                      <motion.div 
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        onClick={() => setSelectedProduct(item)}
                        className="group flex flex-col cursor-pointer p-4 -m-4 rounded-2xl hover:bg-white/5 transition-colors"
                      >
                        {item.image && (
                          <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex justify-between items-baseline mb-3 gap-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#E8B904] transition-colors">
                              {item.name}
                            </h3>
                            {item.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-[#E8B904]/10 text-[#E8B904] border border-[#E8B904]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="w-full flex-1 border-b border-white/10 hidden sm:block mx-2" />
                          <span className="text-[#E8B904] font-black text-lg">
                            {item.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-end gap-4">
                          <p className="text-white/50 text-sm leading-relaxed max-w-[80%]">
                            {item.description}
                          </p>
                          <button className="text-xs font-bold uppercase tracking-widest text-[#E8B904] opacity-100 transition-opacity bg-[#E8B904]/10 hover:bg-[#E8B904]/20 px-3 py-1.5 rounded-full">
                            Add +
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : dataSource === 'fallback' ? (
              /* Fallback: show all categories as tabs */
              <div>
                {fallbackMenuData.map((section) => (
                  <div 
                    key={section.category}
                    className={activeSelection?.name === section.category || !activeSelection || activeSelection.name === fallbackMenuData[0].category ? "block" : "hidden"}
                  >
                    <div className="flex items-center gap-6 mb-12">
                      <h2 className="text-3xl lg:text-4xl font-sans font-black text-white uppercase tracking-tight">
                        {section.category}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#E8B904]/50 to-transparent" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                      {section.items.map((item, idx) => (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          onClick={() => setSelectedProduct(item)}
                          className="group flex flex-col cursor-pointer p-4 -m-4 rounded-2xl hover:bg-white/5 transition-colors"
                        >
                          {item.image && (
                            <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="flex justify-between items-baseline mb-3 gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-bold text-white group-hover:text-[#E8B904] transition-colors">
                                {item.name}
                              </h3>
                              {item.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-[#E8B904]/10 text-[#E8B904] border border-[#E8B904]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="w-full flex-1 border-b border-white/10 hidden sm:block mx-2" />
                            <span className="text-[#E8B904] font-black text-lg">
                              {item.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-end gap-4">
                            <p className="text-white/50 text-sm leading-relaxed max-w-[80%]">
                              {item.description}
                            </p>
                            <button className="text-xs font-bold uppercase tracking-widest text-[#E8B904] opacity-100 transition-opacity bg-[#E8B904]/10 hover:bg-[#E8B904]/20 px-3 py-1.5 rounded-full">
                              Add +
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* API Data: show products for selected category */
              <div>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-3xl lg:text-4xl font-sans font-black text-white uppercase tracking-tight">
                    {currentTitle}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#E8B904]/50 to-transparent" />
                  <span className="text-white/30 text-sm font-medium">
                    {displayedItems.length} {displayedItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {displayedItems.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-900/30 border border-white/5 rounded-3xl">
                    <Layers className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">No products in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    {displayedItems.map((item, idx) => (
                      <motion.div 
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        onClick={() => setSelectedProduct(item)}
                        className="group flex flex-col cursor-pointer p-4 -m-4 rounded-2xl hover:bg-white/5 transition-colors"
                      >
                        {item.image && (
                          <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex justify-between items-baseline mb-3 gap-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#E8B904] transition-colors">
                              {item.name}
                            </h3>
                            {item.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-[#E8B904]/10 text-[#E8B904] border border-[#E8B904]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="w-full flex-1 border-b border-white/10 hidden sm:block mx-2" />
                          <span className="text-[#E8B904] font-black text-lg">
                            {item.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-end gap-4">
                          <p className="text-white/50 text-sm leading-relaxed max-w-[80%]">
                            {item.description}
                          </p>
                          <button className="text-xs font-bold uppercase tracking-widest text-[#E8B904] opacity-100 transition-opacity bg-[#E8B904]/10 hover:bg-[#E8B904]/20 px-3 py-1.5 rounded-full">
                            Add +
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct}
      />
    </section>
  );
}