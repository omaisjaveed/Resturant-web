'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { aboutPageAPI } from '@/lib/api';

const defaultTimeline = [
  { year: '2005', title: 'Two Hearts Meet', description: 'We met in 2005, embarking on a shared journey of love and family, with no idea where this path would lead us next.' },
  { year: '2008', title: 'The Beginning', description: 'Started as a small family kitchen serving authentic Haitian food to the local community, building a foundation of flavor and love.' },
  { year: '2012', title: 'Expanding Roots', description: 'Introduced classic Southern Soul Food to our menu, creating our signature fusion that won the hearts of many.' },
  { year: '2018', title: 'First Restaurant', description: 'Opened our first official dine-in location in Elgin, IL, bringing our home-cooked meals to a wider audience.' },
  { year: 'Today', title: 'A Culinary Destination', description: 'Now an establishment known for exceptional quality, vibrant atmosphere, and a place where two rich culinary cultures meet.' }
];

const defaultContent = {
  journey_label: 'Our Heritage',
  journey_heading: 'The Journey',
  journey_paragraph_1: 'We met in 2005 with no idea that life would lead us here. What started as two hearts finding each other grew into a family, and then into a dream we could build together.',
  journey_paragraph_2: 'Our restaurant is the next chapter of that story. It\'s where our roots meet: the bold, vibrant flavors of Haiti and the comforting warmth of Southern soul food. From tender griot to smothered pork chops, from diri ak djon djon to mac and cheese, we invite you to mix and match dishes and create a plate that feels like home.',
  journey_paragraph_3: 'We believe in keeping everything "Hot and Fresh, Fast and Friendly, Clean and Safe" because that\'s how families deserve to be served. This is more than food to us. It\'s culture, it\'s family, it\'s love on a plate. We welcome everyone to pull up a chair at our table.',
};

export default function OurJourneySection() {
  const [timeline, setTimeline] = useState(defaultTimeline);
  const [content, setContent] = useState(defaultContent);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await aboutPageAPI.getAll();
        const c = data.content || {};

        setContent({
          journey_label: c.journey_label?.value || defaultContent.journey_label,
          journey_heading: c.journey_heading?.value || defaultContent.journey_heading,
          journey_paragraph_1: c.journey_paragraph_1?.value || defaultContent.journey_paragraph_1,
          journey_paragraph_2: c.journey_paragraph_2?.value || defaultContent.journey_paragraph_2,
          journey_paragraph_3: c.journey_paragraph_3?.value || defaultContent.journey_paragraph_3,
        });

        if (c.journey_timeline?.value) {
          try {
            const parsedTimeline = JSON.parse(c.journey_timeline.value);
            if (Array.isArray(parsedTimeline) && parsedTimeline.length > 0) {
              setTimeline(parsedTimeline);
            }
          } catch (e) {
            console.error('Failed to parse journey timeline:', e);
          }
        }
      } catch (error) {
        console.error('Journey content load error:', error);
      }
    };
    fetchContent();
  }, []);

  // Split heading into parts for "The Journey" format
  const headingParts = content.journey_heading.split('Journey');

  return (
    <section ref={containerRef} className="py-24 bg-neutral-900 border-t border-b border-[#E8B904]/20 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8B904]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A31616]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="text-[#E8B904] font-serif italic text-xl mb-4">{content.journey_label}</p>
          <h2 className="text-5xl md:text-6xl font-sans font-black tracking-tighter text-white uppercase mb-8">
            {headingParts.length > 1 ? (
              <>{headingParts[0]}<span className="text-[#E8B904]">Journey</span>{headingParts.slice(1).join('Journey')}</>
            ) : (
              content.journey_heading
            )}
          </h2>
          <div className="space-y-6 text-white/80 leading-relaxed font-sans text-base md:text-lg text-center bg-black/40 border border-white/5 p-8 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
            <p>{content.journey_paragraph_1}</p>
            <p>{content.journey_paragraph_2}</p>
            <p>{content.journey_paragraph_3}</p>
          </div>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E8B904]/50 to-transparent transform md:-translate-x-1/2" />
          
          <motion.div 
            className="absolute left-[15px] md:left-[calc(50%-1px)] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#A31616] to-[#A31616] origin-top shadow-[0_0_15px_rgba(163,22,22,1)]"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={item.year} className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Empty space for alternative side on desktop */}
                  <div className="hidden md:block w-5/12" />

                  {/* Center Dot */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#E8B904] border-4 border-black transform -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(232,185,4,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                    <div className="bg-black/50 backdrop-blur-md border border-[#E8B904]/20 rounded-3xl p-8 hover:bg-black/80 transition-colors">
                      <span className="text-[#E8B904] font-black text-4xl mb-4 block tracking-tighter">{item.year}</span>
                      <h3 className="text-white font-bold text-2xl uppercase tracking-wide mb-4">{item.title}</h3>
                      <p className="text-white/70 leading-relaxed font-sans">{item.description}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
