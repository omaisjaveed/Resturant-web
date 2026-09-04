'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { testimonialAPI, homePageAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const defaultTitle = 'Testimonials';

const getFullImageUrl = (url: string | undefined) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

function TestimonialCard({ t }: { t: any }) {
  return (
    <div className="w-[380px] p-8 bg-neutral-900 rounded-2xl border border-[#E8B904]/20 flex-shrink-0 flex flex-col">
      <div className="text-[#E8B904] mb-6">
        <Quote className="w-8 h-8" />
      </div>
      <p className="font-sans text-[17px] leading-relaxed text-[#E8B904] mb-8 font-medium flex-grow">&quot;{t.quote}&quot;</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-800 rounded-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getFullImageUrl(t.avatar_url || undefined) || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(t.name)}`} alt={t.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-sans font-bold text-[#E8B904] text-sm">{t.name}</h4>
          <p className="text-[#E8B904]/60 text-xs font-medium">{t.company}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState(defaultTitle);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialAPI.getAll();
        setTestimonials(data.testimonials || []);
      } catch (error) {
        console.error('Testimonials load error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        const data = await homePageAPI.getAll();
        setSectionTitle(data.content?.testimonials_title?.value || defaultTitle);
      } catch (error) {
        console.error('Home page content load error:', error);
      }
    };

    fetchHomePageContent();
  }, []);

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { quote: "Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator.", name: "Isabella Rodriguez", company: "CEO and Founder at DEF Company" },
    { quote: "Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.", name: "Gabrielle Williams", company: "CEO and Founder at XYZ Company" },
    { quote: "Exceeded our expectations with innovative designs that brought our vision to life - a truly remarkable creative agency.", name: "Samantha Johnson", company: "CEO and Founder at ABC Company" }
  ];

  return (
    <section className="py-24 bg-transparent overflow-hidden border-t border-b border-[#E8B904]/10">
      <div className="flex flex-col items-center mb-16 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#E8B904]">
          {sectionTitle}
        </h2>
      </div>

      <div className="relative flex flex-col gap-8 w-full overflow-hidden">
        <div className="flex w-full">
          <motion.div 
            className="flex gap-8 px-4"
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          >
            {[...displayTestimonials, ...displayTestimonials, ...displayTestimonials].map((t, i) => (
              <TestimonialCard key={`marquee-${i}`} t={t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
