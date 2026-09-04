'use client';
import { useState, useRef, useEffect } from 'react';
import { productAPI, homePageAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getFullImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

const fallbackRecipes = [
  { name: 'Soul Fried Chicken', image: 'https://i.ibb.co/XfjJ2c5X/images-11.jpg' },
  { name: 'Catfish Dinner', image: 'https://i.ibb.co/VWp5nBYC/Catfish-Dinner-your-choice-of-rice-and-2-sides.jpg' },
  { name: 'Grilled Lamb Chops', image: 'https://i.ibb.co/qMcg2Y9K/Grilled-Lamb-Chops-with-your-choice-of-rice-and-2-sides.jpg' },
  { name: 'Wing Dinner', image: 'https://i.ibb.co/PzThQvkr/Wing-dinner-w-2-sides.jpg' },
  { name: 'Baked Chicken Dinner', image: 'https://i.ibb.co/Cp4ZvDM6/baked-chicken-Dinner-W-your-choice-of-rice-and-2-sides.jpg' },
  { name: 'Bongou Cheddar Burger', image: 'https://i.ibb.co/6Rhj03K3/Bongou-Cheddar-Burger-n-Frys.jpg' }
];

export default function RecipesCarousel() {
  const defaultTitle = 'BEST SELLERS';
  const defaultDescription = 'Discover our most popular dishes, from Soul Fried Chicken to authentic Haitian specialties. A true taste of soul food combined with tradition.';
  const [recipes, setRecipes] = useState(fallbackRecipes);
  const [bestSellersTitle, setBestSellersTitle] = useState(defaultTitle);
  const [bestSellersDescription, setBestSellersDescription] = useState(defaultDescription);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productAPI.getFeatured();
        if (data.products && data.products.length > 0) {
          const mapped = data.products.map((product: any) => ({
            name: product.name,
            image: getFullImageUrl(product.image_url) || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920'
          }));
          setRecipes(mapped.length > 0 ? mapped : fallbackRecipes);
        }
      } catch (error) {
        console.error('Featured products fetch failed:', error);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        const data = await homePageAPI.getAll();
        setBestSellersTitle(data.content?.best_sellers_title?.value || defaultTitle);
        setBestSellersDescription(data.content?.best_sellers_description?.value || defaultDescription);
      } catch (error) {
        console.error('Home page content load error:', error);
      }
    };

    fetchHomePageContent();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    const middleIndex = Math.floor(items.length / 2);
    requestAnimationFrame(() => {
      const target = items[middleIndex];
      if (target) {
        container.scrollTo({
          left: (target as HTMLElement).offsetLeft - container.clientWidth / 2 + (target as HTMLElement).clientWidth / 2,
          behavior: 'instant' as ScrollBehavior
        });
        setActiveIndex(middleIndex);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(index);
          }
        });
      },
      {
        root: container,
        rootMargin: '0px -49% 0px -49%',
        threshold: 0
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [recipes]);

  const extendedRecipes = [...recipes, ...recipes, ...recipes, ...recipes];

  return (
    <section className="py-24 bg-transparent overflow-hidden select-none relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A31616]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E8B904]/5 rounded-full blur-[100px] pointer-events-none" />

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div className="container mx-auto px-6 text-center max-w-4xl mb-16 relative z-10">
        <h2 className="text-[60px] md:text-[80px] font-sans font-black tracking-normal mb-6 bg-gradient-to-r from-[#A31616] via-[#E8B904] to-[#A31616] bg-clip-text text-transparent drop-shadow-sm">
          {bestSellersTitle}
        </h2>
        <p className="text-[#E8B904]/90 font-sans font-medium text-sm md:text-base leading-relaxed max-w-xl mx-auto px-4">
          {bestSellersDescription}
        </p>
      </div>

      <div 
        ref={containerRef}
        className="flex items-center overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-8 no-scrollbar w-full pt-10 pb-20 cursor-grab active:cursor-grabbing relative z-10"
      >
        <div className="shrink-0 w-[calc(50vw-90px)] sm:w-[calc(50vw-140px)]" />
        {extendedRecipes.map((recipe, index) => {
          const isActive = index === activeIndex;
          return (
            <div key={`wrapper-${index}`} className="flex items-center shrink-0">
              <div 
                data-index={index}
                className="carousel-item shrink-0 snap-center relative flex justify-center items-center cursor-pointer w-[180px] sm:w-[280px] h-[260px] sm:h-[380px]"
                onClick={() => {
                  const container = containerRef.current;
                  const target = container?.querySelectorAll('.carousel-item')[index];
                  if (container && target) {
                    container.scrollTo({
                      left: (target as HTMLElement).offsetLeft - container.clientWidth / 2 + (target as HTMLElement).clientWidth / 2,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'scale-[1.0] sm:scale-[1.05] z-30 shadow-2xl' : 'scale-[0.80] z-10 opacity-100 hover:opacity-100 shadow-xl'
                }`}>
                  <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={recipe.image} 
                      alt={recipe.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className={`absolute bottom-6 sm:bottom-8 left-0 right-0 px-4 sm:px-6 text-center transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <h3 className="text-white font-sans font-black text-lg sm:text-xl leading-tight shadow-black drop-shadow-lg">
                        {recipe.name}
                      </h3>
                      <div className="w-10 h-1 bg-gradient-to-r from-[#E8B904] to-[#CFA203] mx-auto mt-4 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="shrink-0 w-[calc(50vw-90px)] sm:w-[calc(50vw-140px)]" />
      </div>

      <div className="flex justify-center mb-8 relative z-10">
        <button className="px-8 py-3 bg-gradient-to-r from-[#E8B904] to-[#CFA203] text-[#A31616] font-black uppercase text-[15px] tracking-[0.05em] rounded-[16px] hover:scale-105 hover:from-[#E8B904] hover:to-[#E8B904] transition-all duration-300 shadow-xl">
          View Menu
        </button>
      </div>
    </section>
  );
}