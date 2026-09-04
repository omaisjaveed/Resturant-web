'use client';

import { useEffect, useState } from 'react';
import { aboutPageAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getFullImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

const defaultContent = {
  about_story_label: 'Our Story',
  about_heading: 'ABOUT BONGOU',
  about_paragraph_1: 'Founded by passionate chefs with deep roots in Haitian cuisine and a love for Southern Soul Food, Bongou brings together the best of both worlds in every dish we serve.',
  about_paragraph_2: 'We believe that food is more than just sustenance; it is a way to share culture, history, and love. Our recipes have been passed down through generations, refined to perfection, yet retaining that comforting, home-cooked feel.',
  about_paragraph_3: 'From our crispy Soul Fried Chicken to our rich, hearty Griot, every item on our menu is prepared fresh daily using only the highest quality ingredients. Whether you are dining in, picking up, or booking our catering services for an event, we promise an unforgettable flavor experience that will keep you coming back for more.',
  about_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
  about_badge_number: '15+',
  about_badge_label: 'Years of Experience',
  about_stat_1_title: 'Authentic Flavors',
  about_stat_1_desc: 'Blended spices from traditional recipes.',
  about_stat_2_title: 'Fresh Ingredients',
  about_stat_2_desc: 'Locally sourced produce and premium meats.',
};

export default function AboutUsSection() {
  const [content, setContent] = useState(defaultContent);
  const [imageUrl, setImageUrl] = useState(defaultContent.about_image_url);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await aboutPageAPI.getAll();
        const c = data.content || {};
        setContent({
          about_story_label: c.about_story_label?.value || defaultContent.about_story_label,
          about_heading: c.about_heading?.value || defaultContent.about_heading,
          about_paragraph_1: c.about_paragraph_1?.value || defaultContent.about_paragraph_1,
          about_paragraph_2: c.about_paragraph_2?.value || defaultContent.about_paragraph_2,
          about_paragraph_3: c.about_paragraph_3?.value || defaultContent.about_paragraph_3,
          about_image_url: c.about_image_url?.value || defaultContent.about_image_url,
          about_badge_number: c.about_badge_number?.value || defaultContent.about_badge_number,
          about_badge_label: c.about_badge_label?.value || defaultContent.about_badge_label,
          about_stat_1_title: c.about_stat_1_title?.value || defaultContent.about_stat_1_title,
          about_stat_1_desc: c.about_stat_1_desc?.value || defaultContent.about_stat_1_desc,
          about_stat_2_title: c.about_stat_2_title?.value || defaultContent.about_stat_2_title,
          about_stat_2_desc: c.about_stat_2_desc?.value || defaultContent.about_stat_2_desc,
        });
        setImageUrl(c.about_image_url?.value || defaultContent.about_image_url);
      } catch (error) {
        console.error('About page content load error:', error);
      }
    };
    fetchContent();
  }, []);

  // Split heading into parts for the "ABOUT BONGOU" format
  const headingParts = content.about_heading.split('BONGOU');
  const headingBefore = headingParts[0] || '';
  const headingAfter = headingParts.length > 1 ? headingParts.slice(1).join('BONGOU') : '';

  return (
    <section className="py-24 bg-transparent text-[#FDF5E6]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="w-full aspect-[4/5] relative rounded-3xl overflow-hidden border border-[#E8B904]/20 shadow-2xl">
              {!imageError ? (
                <img 
                  src={getFullImageUrl(imageUrl)}
                  alt="Cooking food"
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <span className="text-white/40">Image not available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            {/* Some floating badge element */}
            <div className="absolute -bottom-10 -right-10 lg:bottom-10 lg:-right-10 bg-black border border-[#E8B904]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <p className="text-[#E8B904] font-bold text-4xl mb-1">{content.about_badge_number}</p>
              <p className="text-white/80 text-sm font-sans uppercase tracking-widest">{content.about_badge_label}</p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <p className="text-[#E8B904] font-serif italic text-xl mb-4">{content.about_story_label}</p>
            <h2 className="text-5xl md:text-6xl font-sans font-black tracking-tighter text-white uppercase mb-8">
              {headingBefore}
              {headingBefore && !headingAfter ? (
                <>ABOUT <span className="text-[#E8B904]">BONGOU</span></>
              ) : headingParts.length > 1 ? (
                <>{headingParts[0]}<span className="text-[#E8B904]">BONGOU</span>{headingAfter}</>
              ) : (
                content.about_heading
              )}
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed font-sans text-lg">
              <p>{content.about_paragraph_1}</p>
              <p>{content.about_paragraph_2}</p>
              <p>{content.about_paragraph_3}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12 w-full border-t border-[#E8B904]/20 pt-12">
              <div>
                <h4 className="text-white font-bold text-lg mb-2">{content.about_stat_1_title}</h4>
                <p className="text-white/60 text-sm">{content.about_stat_1_desc}</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">{content.about_stat_2_title}</h4>
                <p className="text-white/60 text-sm">{content.about_stat_2_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
