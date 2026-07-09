'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import CartDrawer from './cart-drawer';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const user = useStore((state) => state.user);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Lookbook', href: '/lookbook' },
    { name: 'Admin', href: '/admin' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[99] transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-[#050505]/75 backdrop-blur-md border-white/5 py-4'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.25em] text-white hover:opacity-80 transition-opacity cursor-none"
          >
            BASIC
          </Link>

          {/* Center: Main Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-none relative py-1 ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-5">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white/80 hover:text-white transition-colors cursor-none"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Account Profile Link */}
            <Link
              href={user ? '/admin' : '/auth'}
              className="text-white/80 hover:text-white transition-colors cursor-none"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/shop?wishlist=true"
              className="text-white/80 hover:text-white transition-colors cursor-none relative"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black font-semibold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white/85 hover:text-white transition-colors cursor-none relative"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black font-semibold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-white/80 transition-colors cursor-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-[60px] left-0 right-0 bottom-0 bg-[#050505] z-[98] p-8 flex flex-col space-y-8 animate-fade-in border-t border-white/5">
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm uppercase tracking-widest text-white/85 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Fullscreen Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex flex-col">
          <div className="p-6 md:p-12 flex justify-end">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:opacity-60 transition-opacity cursor-none"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto px-6 w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSearchOpen(false);
                window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
              }}
            >
              <input
                type="text"
                autoFocus
                placeholder="SEARCH FOR GARMETS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/30 text-2xl md:text-5xl uppercase tracking-widest pb-6 focus:outline-none focus:border-white transition-colors"
              />
              <p className="text-[10px] md:text-xs text-white/40 tracking-[0.2em] uppercase mt-4">
                Press enter to search the database catalog
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
