import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 bg-transparent border-t border-[#E8B904]/40 relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <div className="relative w-40 h-28 md:w-56 md:h-36 mb-4">
              <img
                src="https://bongou.devnode.amgdigitalagency.com/bongou-api/uploads/e354c3eb-42df-46b4-b563-ff35da75cc94.png"
                alt="Bongou Logo"
                className="w-full h-full object-contain object-center cursor-pointer drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6 font-sans">
              Experience the true taste of soul food with authentic Haitian specialties. 
              Fresh ingredients, unforgettable flavors.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-[#E8B904]/40 flex items-center justify-center text-[#E8B904] hover:bg-[#E8B904] hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#E8B904]/40 flex items-center justify-center text-[#E8B904] hover:bg-[#E8B904] hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#E8B904]/40 flex items-center justify-center text-[#E8B904] hover:bg-[#E8B904] hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-[#E8B904] font-bold uppercase tracking-wider mb-6 text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Home</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">About Us</Link></li>
              <li><Link href="/menu" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Our Menu</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Reservations</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col">
            <h4 className="text-[#E8B904] font-bold uppercase tracking-wider mb-6 text-sm">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Terms of Service</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Cookie Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-[#E8B904] transition-colors text-sm font-sans">Allergen Information</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col">
            <h4 className="text-[#E8B904] font-bold uppercase tracking-wider mb-6 text-sm">Newsletter</h4>
            <p className="text-white/70 text-sm leading-relaxed mb-4 font-sans">
              Subscribe to stay updated with our latest offers and seasonal menus.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-black/40 border border-[#E8B904]/40 rounded-xl px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#E8B904] transition-colors w-full"
              />
              <button className="bg-[#A31616] hover:bg-[#800F0F] text-white font-bold uppercase tracking-widest text-xs py-3 px-6 rounded-xl transition-colors w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E8B904]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm font-sans text-center md:text-left">
            &copy; {new Date().getFullYear()} Bongou Soul Food Restaurant. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-white/50 text-sm font-sans">Designed with <span className="text-[#E8B904]">♥</span> for Soul Food</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
