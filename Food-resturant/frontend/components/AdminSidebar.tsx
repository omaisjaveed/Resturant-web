'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Package, Layers, ShoppingBag, Image, 
  Settings, MessageCircle, Home, LogOut, Info, Mail, 
  ChevronDown, Menu, X, Search, ArrowRight,
  BarChart3
} from 'lucide-react';

const navGroups = [
  {
    title: 'Content Management',
    description: 'Manage your website content',
    items: [
      { href: '/admin/home', label: 'Home Page', icon: Home, description: 'Edit homepage sections' },
      { href: '/admin/about', label: 'About Us', icon: Info, description: 'Manage about page' },
      { href: '/admin/contact', label: 'Contact', icon: Mail, description: 'Contact information' },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageCircle, description: 'Customer reviews' },
      { href: '/admin/media', label: 'Media Library', icon: Image, description: 'Images & files' },
    ],
    gridCols: 2,
  },
  {
    title: 'Store Management',
    description: 'Handle products & orders',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package, description: 'Manage inventory' },
      { href: '/admin/categories', label: 'Categories', icon: Layers, description: 'Organize items' },
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, description: 'View transactions' },
    ],
    gridCols: 2,
  },
  {
    title: 'System',
    description: 'Administration',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings, description: 'App configuration' },
    ],
    gridCols: 1,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close mega menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMegaMenuOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Focus search when mega menu opens
  useEffect(() => {
    if (megaMenuOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [megaMenuOpen]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setSearchQuery('');
    }, 200);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const closeMenu = useCallback(() => {
    setMegaMenuOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  }, []);

  const isDashboardActive = pathname === '/admin/dashboard';

  // Filter nav items based on search
  const allItems = navGroups.flatMap(g => g.items);
  const filteredItems = searchQuery
    ? allItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <header className="bg-neutral-900 border-b border-[#E8B904]/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo (left) */}
          <Link 
            href="/admin/dashboard" 
            className="relative group shrink-0"
          >
            <span className="text-xl sm:text-2xl font-black text-[#E8B904]">
              Bongou
              <span className="text-white"> Admin</span>
            </span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#E8B904] transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <div className="relative" style={{ perspective: '1000px' }}>
              <button
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  setMegaMenuOpen(!megaMenuOpen);
                  if (!megaMenuOpen) setSearchQuery('');
                }}
                className={`
                  relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isDashboardActive || megaMenuOpen
                    ? 'bg-[#E8B904] text-black shadow-lg shadow-[#E8B904]/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                  ${megaMenuOpen ? 'scale-105' : ''}
                `}
              >
                <LayoutDashboard className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-12' : ''}`} />
                <span>Dashboard</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-all duration-200 ${megaMenuOpen ? 'rotate-180 translate-y-0.5' : ''}`} />
                
                {/* Active indicator */}
                {isDashboardActive && !megaMenuOpen && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E8B904]" />
                )}
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <>
                  {/* Backdrop overlay */}
                  <div 
                    className="fixed inset-0 z-40"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => {
                        setMegaMenuOpen(false);
                        setSearchQuery('');
                      }, 200);
                    }}
                  />
                  
                  <div
                    ref={megaMenuRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-[720px] origin-top animate-mega-in"
                  >
                    <div className="relative bg-neutral-800/95 backdrop-blur-xl border border-[#E8B904]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                      {/* Decorative gradient */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8B904]/50 to-transparent" />
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E8B904]/5 rounded-full blur-3xl" />
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

                      {/* Search bar */}
                      <div className="relative px-5 pt-4 pb-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search admin pages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-700/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-[#E8B904]/30 focus:ring-1 focus:ring-[#E8B904]/20 transition-all"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              <X className="w-3 h-3 text-white/40" />
                            </button>
                          )}
                        </div>
                      </div>

                      {filteredItems ? (
                        /* Search results view */
                        <div className="p-5 pt-2">
                          <p className="text-white/40 text-xs mb-3">
                            {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                          </p>
                          {filteredItems.length > 0 ? (
                            <div className="space-y-1">
                              {filteredItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`
                                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                      ${isActive
                                        ? 'bg-[#E8B904]/20 text-[#E8B904]'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                      }
                                    `}
                                  >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span>{item.label}</span>
                                      <p className="text-xs text-white/30 truncate">{item.description}</p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                                  </Link>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Search className="w-8 h-8 text-white/20 mx-auto mb-2" />
                              <p className="text-white/40 text-sm">No results found</p>
                              <p className="text-white/20 text-xs mt-1">Try a different search term</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Normal nav groups view */
                        <div className="p-5 pt-2">
                          <div className="grid grid-cols-2 gap-4">
                            {navGroups.map((group) => (
                              <div 
                                key={group.title} 
                                className={`${group.items.length === 1 ? 'col-span-2' : 'col-span-1'}`}
                              >
                                <div className="relative group-section">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-4 bg-[#E8B904] rounded-full" />
                                    <div>
                                      <h3 className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                                        {group.title}
                                      </h3>
                                      <p className="text-white/30 text-[10px] mt-0.5">{group.description}</p>
                                    </div>
                                  </div>
                                  
                                  <div className={`gap-1.5 ${group.gridCols === 1 ? 'grid-cols-1 grid' : 'grid-cols-2 grid'}`}>
                                    {group.items.map((item) => {
                                      const Icon = item.icon;
                                      const isActive = pathname === item.href;
                                      return (
                                        <Link
                                          key={item.href}
                                          href={item.href}
                                          onClick={closeMenu}
                                          className={`
                                            group-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                                            transition-all duration-150 relative overflow-hidden
                                            ${isActive
                                              ? 'bg-[#E8B904]/15 text-[#E8B904]'
                                              : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }
                                          `}
                                        >
                                          {/* Hover glow effect */}
                                          <div className="absolute inset-0 bg-gradient-to-r from-[#E8B904]/0 via-[#E8B904]/5 to-[#E8B904]/0 opacity-0 group-item-hover:opacity-100 transition-opacity duration-300" />
                                          
                                          <div className={`
                                            relative flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-200
                                            ${isActive
                                              ? 'bg-[#E8B904]/20 text-[#E8B904]'
                                              : 'bg-white/5 text-white/50 group-item-hover:bg-white/10 group-item-hover:text-white'
                                            }
                                          `}>
                                            <Icon className="w-4 h-4" />
                                          </div>
                                          
                                          <div className="relative flex-1 min-w-0">
                                            <span className="block leading-tight">{item.label}</span>
                                            <span className="block text-[10px] text-white/30 truncate mt-0.5">
                                              {item.description}
                                            </span>
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Links */}
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <Link
                                href="/admin/dashboard"
                                onClick={closeMenu}
                                className={`
                                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                                  ${pathname === '/admin/dashboard'
                                    ? 'bg-[#E8B904] text-black'
                                    : 'text-white/50 hover:text-white hover:bg-white/10'
                                  }
                                `}
                              >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>Dashboard Overview</span>
                              </Link>
                              <span className="text-white/20 text-[10px]">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Desktop Logout (right) */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile: Hamburger + Logout */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide Down */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 animate-mobile-in max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-700/50 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-[#E8B904]/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-3 h-3 text-white/40" />
                </button>
              )}
            </div>

            {/* Filtered search or groups */}
            {searchQuery ? (
              <div className="space-y-0.5">
                {allItems
                  .filter(item => 
                    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setMobileMenuOpen(false); setSearchQuery(''); }}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                          ${isActive
                            ? 'bg-[#E8B904]/20 text-[#E8B904]'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? 'bg-[#E8B904]/20' : 'bg-white/5'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block">{item.label}</span>
                          <span className="block text-[10px] text-white/30 truncate">{item.description}</span>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : (
              /* Mega Menu Groups for Mobile */
              <>
                {/* Dashboard quick link */}
                <Link
                  href="/admin/dashboard"
                  onClick={() => { setMobileMenuOpen(false); setSearchQuery(''); }}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all mb-3
                    ${pathname === '/admin/dashboard'
                      ? 'bg-[#E8B904] text-black'
                      : 'bg-white/5 text-white/70 hover:text-white'
                    }
                  `}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </Link>

                {navGroups.map((group) => (
                  <div key={group.title} className="mb-3">
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <div className="w-1 h-3 bg-[#E8B904] rounded-full" />
                      <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                        {group.title}
                      </h3>
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => { setMobileMenuOpen(false); setSearchQuery(''); }}
                            className={`
                              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                              ${isActive
                                ? 'bg-[#E8B904]/20 text-[#E8B904]'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                              }
                            `}
                          >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? 'bg-[#E8B904]/20' : 'bg-white/5'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block">{item.label}</span>
                              <span className="block text-[10px] text-white/30 truncate">{item.description}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes megaIn {
          from {
            opacity: 0;
            transform: translateY(-8px) rotateX(-4deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }
        
        @keyframes mobileIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 70vh;
          }
        }
        
        .animate-mega-in {
          animation: megaIn 0.2s ease-out forwards;
        }
        
        .animate-mobile-in {
          animation: mobileIn 0.25s ease-out forwards;
        }
      `}</style>
    </header>
  );
}