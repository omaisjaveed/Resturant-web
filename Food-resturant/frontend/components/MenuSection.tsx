'use client';

import { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import { categoryAPI, productAPI, homePageAPI } from '@/lib/api';

const fallbackMenuData = [
  {
    slug: 'entrees',
    category: 'Entrees',
    items: [
      { name: 'Soul Fried Chicken', tags: ['Popular'], description: '3pc (+$1 All White) (+$2.50 All Wings 4pc)', price: '$16.00' },
      { name: 'Soul Baked Chicken', tags: [], description: '3pc', price: '$16.00', image: 'https://i.ibb.co/Cp4ZvDM6/baked-chicken-Dinner-W-your-choice-of-rice-and-2-sides.jpg' },
      { name: 'Red Snapper', tags: ['Seafood'], description: 'Southern or Creole style.', price: '$32.00' },
      { name: 'Soul Smothered Turkey Wings', tags: [], description: 'Tender and flavorful', price: '$16.00' },
      { name: 'Grilled Lamb Chops', tags: [], description: '3pc', price: '$28.00', image: 'https://i.ibb.co/qMcg2Y9K/Grilled-Lamb-Chops-with-your-choice-of-rice-and-2-sides.jpg' },
      { name: 'Oxtail Pasta bowl', tags: [], description: 'Rich and savory', price: '$18.00' },
      { name: 'Haitian Griot (fried pork)', tags: ['Authentic'], description: 'Classic Haitian dish', price: '$18.00' },
      { name: 'Haitian Oxtail (Ke bef)', tags: [], description: 'Rich and savory oxtail stew', price: '$28.00' },
      { name: 'Haitian Chicken stewed', tags: [], description: '( Poule nan sauce) 3pc (+$1 All White)', price: '$16.00' },
      { name: 'Haitian Fried Turkey', tags: [], description: '(Kodenn fri)', price: '$16.00' },
      { name: 'Haitian Legume', tags: ['Veg Option'], description: 'Hearty vegetable stew', price: '$18.00' }
    ],
    images: [
      'https://i.ibb.co/6kx9YMQ/Entrees.jpg',
      'https://i.ibb.co/VWp5nBYC/Catfish-Dinner-your-choice-of-rice-and-2-sides.jpg',
      'https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/3a40c770-cc01-400c-a8a8-a36cd32de388.jpg',
      'https://i.ibb.co/Cp4ZvDM6/baked-chicken-Dinner-W-your-choice-of-rice-and-2-sides.jpg',
      'https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/4881f8a6-460d-4207-a5bc-1d3874b5f16d.jpg',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1920'
    ],
    imageFirst: false
  },
  {
    slug: 'sides',
    category: 'Sides (8oz)',
    items: [
      { name: 'White Rice', tags: ['Vegan'], description: '(Diri blan)', price: '$4.00', image: 'https://i.ibb.co/JRh2jmT6/White-Rice.jpg' },
      { name: 'Black Rice', tags: ['Popular'], description: '(Diri a djon djon)', price: '$5.00', image: 'https://i.ibb.co/3m3Cn5SH/Creole-Black-rice.jpg' },
      { name: 'Rice & Peas', tags: ['Veg'], description: '(Diri a pois)', price: '$5.00', image: 'https://i.ibb.co/3YpYPnnH/Creole-Red-beans-and-rice.jpg' },
      { name: 'Mac and Cheese', tags: ['Veg', 'Popular'], description: 'Creamy and cheesy', price: '$6.50', image: 'https://i.ibb.co/S7K6kt4m/Southern-Cheesy-Baked-Mac-n-Cheese.jpg' },
      { name: 'Collard Greens', tags: [], description: 'Slow-cooked classic', price: '$5.00', image: 'https://i.ibb.co/cSSg8hKM/Southern-Collard-Greens.jpg' },
      { name: 'Green Beans', tags: ['Veg'], description: 'Fresh and flavorful', price: '$5.00', image: 'https://i.ibb.co/xtyFpMMQ/Southern-Green-Beans.jpg' },
      { name: "Plantain 'Banane Peze'", tags: ['Veg'], description: '6 pieces served with Pikliz', price: '$4.00' },
      { name: 'Yams', tags: ['Veg'], description: 'Sweet and tender', price: '$5.00', image: 'https://i.ibb.co/rRjhbdzv/Southern-Yams.jpg' },
      { name: 'Side Salad', tags: ['Veg'], description: 'Salad russe', price: '$4.00' },
      { name: 'Fries', tags: ['Veg'], description: 'Crispy and golden', price: '$4.00' }
    ],
    images: [
      'https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/2e8923c3-6f98-411a-bd23-1a7b4af58c59.jpg',
      'https://i.ibb.co/S7K6kt4m/Southern-Cheesy-Baked-Mac-n-Cheese.jpg',
      'https://i.ibb.co/JRh2jmT6/White-Rice.jpg',
      'https://i.ibb.co/cSSg8hKM/Southern-Collard-Greens.jpg',
      'https://i.ibb.co/xtyFpMMQ/Southern-Green-Beans.jpg',
      'https://i.ibb.co/rRjhbdzv/Southern-Yams.jpg'
    ],
    imageFirst: true
  },
  {
    slug: 'specialties',
    category: 'Specialties',
    items: [
      { name: 'Hamburgers', tags: [], description: 'Topped with Cheddar Cheese, Mayo, Ketchup, Lettuce Tomato, Pickles & Onions and served with a side of fries', price: '$11.00' },
      { name: 'Grilled Cheese', tags: ['Veg'], description: 'With melted cheddar and served with a side of fries', price: '$8.00' },
      { name: 'Chicken Tenders', tags: [], description: '3 Tenders served with fries and a side of dipping sauce', price: '$10.00' },
      { name: 'Haitian Pattie', tags: ['Popular'], description: "'Beef, Chicken, Fish' (w/ fries $6)", price: '$4.00' }
    ],
    images: [
      'https://i.ibb.co/xq8YQGfC/Specialties.jpg',
      'https://i.ibb.co/6Rhj03K3/Bongou-Cheddar-Burger-n-Frys.jpg',
      'https://i.ibb.co/7dyZ4xY2/Just-Catfish.jpg',
      'https://i.ibb.co/PzThQvkr/Wing-dinner-w-2-sides.jpg',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1920',
      'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?q=80&w=1920'
    ],
    imageFirst: false
  },
  {
    slug: 'desserts-drinks',
    category: 'Desserts & Beverages',
    items: [
      { name: 'Pound Cake', tags: ['Veg'], description: 'Moist and flavorful, our pound cake is made with love and a hint of vanilla', price: '$8.00' },
      { name: 'Chocolate Cake', tags: ['Veg'], description: "Rich and decadent, our chocolate cake is a chocolate lover's dream", price: '$8.00' },
      { name: 'Sweet Potato Pie', tags: ['Veg'], description: 'A Southern classic, our sweet potato pie is made with love and a hint of spice', price: '$6.00' },
      { name: 'Fountain Drinks', tags: [], description: 'M 21oz ($2.95) / L 32oz ($3.25)', price: '$2.95+' },
      { name: 'Frozen Lemonade', tags: [], description: 'M 21oz', price: '$4.55' },
      { name: 'Haitian Soda / Bottled', tags: [], description: 'Refreshing options', price: '$3.30' }
    ],
    images: [
      'https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/26585aae-decf-4851-bfd3-c5bd895c2b84.jpg',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1920',
      'https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/ae6c85ff-6630-4b31-a545-f8613555cb30.jpg',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1920',
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1920',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1978'
    ],
    imageFirst: true
  }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const defaultTitle = 'POPULAR DELIGHTS';
const defaultDescription = 'Experience the authentic taste of soul food with our selection of traditional dishes, crafted from fresh, high-quality ingredients. From savory Haitian specialties to indulgent desserts, every bite is a celebration of flavors.';

const getFullImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

export default function MenuSection() {
  const [menuData, setMenuData] = useState(fallbackMenuData);
  const [selectedProduct, setSelectedProduct] = useState<{name: string, description: string, price: string, image?: string} | null>(null);
  const [sectionTitle, setSectionTitle] = useState(defaultTitle);
  const [sectionDescription, setSectionDescription] = useState(defaultDescription);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([productAPI.getAll(), categoryAPI.getAll()]);
        if (productsData.products.length > 0 && categoriesData.categories.length > 0) {
          const categoryMap = categoriesData.categories.reduce<Record<string, any>>((acc, cat) => {
            acc[cat.slug] = cat;
            return acc;
          }, {});

          const transformed = fallbackMenuData.map((section) => {
            const category = categoryMap[section.slug];
            const items = category
              ? productsData.products
                  .filter((product) => product.category_id === category.id)
                  .map((product: any) => ({
                    name: product.name,
                    tags: product.featured ? ['Popular'] : [],
                    description: product.description || '',
                    price: `$${Number(product.price).toFixed(2)}`,
                    image: getFullImageUrl(product.image_url)
                  }))
              : [];
            return {
              ...section,
              items: items.length > 0 ? items : section.items
            };
          }).filter((section) => section.items.length > 0);

          if (transformed.length > 0) {
            setMenuData(transformed);
            return;
          }
        }
      } catch (error) {
        console.error('MenuSection fetch error:', error);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        const data = await homePageAPI.getAll();
        setSectionTitle(data.content?.popular_delights_title?.value || defaultTitle);
        setSectionDescription(data.content?.popular_delights_description?.value || defaultDescription);
      } catch (error) {
        console.error('Home page content load error:', error);
      }
    };

    fetchHomePageContent();
  }, []);

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-[#E8B904]/80 font-serif italic text-xl mb-2">Our Special Menu</p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-sans font-black bg-gradient-to-r from-[#E8B904] to-[#CFA203] bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-md">
            {sectionTitle}
          </h2>
          <p className="text-[#E8B904]/60 max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
            {sectionDescription}
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {menuData.map((section, idx) => {
            const isReversed = section.imageFirst;
            return (
              <div key={idx} className={`relative w-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden min-h-[700px] flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} shadow-2xl border border-[#E8B904]/10 group bg-[#0a0a0a]`}>
                
                {/* Image Section Grid */}
                <div className="relative w-full lg:w-5/12 xl:w-1/2 min-h-[400px] sm:min-h-[500px] lg:min-h-full overflow-hidden bg-[#0a0a0a] border-b lg:border-b-0 border-[#E8B904]/10">
                  <div className={`w-full h-full grid gap-0 ${
                    ["Desserts & Beverages", "Specialties"].includes(section.category)
                      ? "grid-cols-2 grid-rows-2" 
                      : "grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-2 lg:grid-rows-3"
                  }`}>
                    {section.images.slice(0, ["Desserts & Beverages", "Specialties"].includes(section.category) ? 4 : 6).map((src, i) => {
                      return (
                        <div key={i} className="relative group/img bg-black overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={src} 
                            alt={`${section.category} Collaged ${i + 1}`} 
                            className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-700" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full lg:w-7/12 xl:w-1/2 flex items-center px-6 lg:px-12 py-12 lg:py-16 bg-black/20 backdrop-blur-md">
                  
                  <div className="w-full max-w-2xl mx-auto rounded-3xl transition-all">
                    <div className="flex items-center gap-4 mb-10">
                      <h3 className="text-4xl lg:text-5xl font-sans font-black tracking-tight text-[#E8B904] drop-shadow-md">{section.category}</h3>
                      <div className="flex-1 h-[2px] bg-gradient-to-r from-[#E8B904]/50 to-transparent" />
                    </div>
                    
                    <div className="flex flex-col gap-8">
                      {section.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx} 
                          onClick={() => setSelectedProduct({
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            image: (item as any).image || (item as any).image_url || undefined
                          })}
                          className="flex flex-col group/item transition-all hover:translate-x-2 duration-300 cursor-pointer p-4 -mx-4 rounded-xl hover:bg-black/20"
                        >
                          <div className="flex items-end mb-2">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 shrink-0">
                              <h4 className="font-bold text-[#f2e6cf] text-lg lg:text-xl tracking-wide group-hover/item:text-[#E8B904] transition-colors">{item.name}</h4>
                              {item.tags.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {item.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-black bg-[#E8B904] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="hidden sm:block flex-grow border-b-2 border-dotted border-[#E8B904]/30 mx-4 mb-2"></div>
                            <div className="shrink-0 text-[#E8B904] text-lg lg:text-xl font-black mt-1 sm:mt-0 ml-auto sm:ml-0 group-hover/item:text-white transition-colors">
                              {item.price}
                            </div>
                          </div>
                          <div className="flex justify-between items-end">
                            <p className="text-sm text-neutral-400 max-w-[80%] leading-relaxed">{item.description}</p>
                            <button className="text-xs font-bold uppercase tracking-widest text-[#E8B904] opacity-100 transition-opacity bg-[#E8B904]/10 hover:bg-[#E8B904]/20 px-3 py-1.5 rounded-full mt-2">
                              Add +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
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
