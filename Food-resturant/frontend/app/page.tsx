import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import CarouselSection from '@/components/CarouselSection';
import RecipesCarousel from '@/components/RecipesCarousel';
import MenuSection from '@/components/MenuSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen relative bg-black selection:bg-[#E8B904]/30 selection:text-[#E8B904]">
      {/* Global flowing animated background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A31616]/20 rounded-full blur-[120px] animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#E8B904]/10 rounded-full blur-[150px] animate-[spin_25s_linear_infinite_reverse]" />
        <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-[#A31616]/15 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] left-[10%] w-[35%] h-[35%] bg-[#E8B904]/10 rounded-full blur-[120px] animate-[pulse_15s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10">
        <NavBar />
        <Hero />
        <RecipesCarousel />
        <MenuSection />
        <TestimonialsSection />
        <ContactSection source="home" />
        <Footer />
      </div>
    </main>
  );
}
