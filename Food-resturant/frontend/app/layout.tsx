import type {Metadata} from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import CartDrawer from '@/components/CartDrawer';
import FloatingCart from '@/components/FloatingCart';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Bongou Soul - Taste of Excellence',
  description: 'A genuine fusion of Soul food and Haitian flavors',
  icons: {
    icon: 'https://i.ibb.co/BVnkY8RJ/bongou-soul.png',
    apple: 'https://i.ibb.co/BVnkY8RJ/bongou-soul.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-black text-[#E8B904] antialiased font-outfit" suppressHydrationWarning>
        {children}
        <CartDrawer />
        <FloatingCart />
      </body>
    </html>
  );
}
