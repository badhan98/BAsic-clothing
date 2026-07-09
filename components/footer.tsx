'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Mock save to LocalStorage newsletter table
    const emails = JSON.parse(localStorage.getItem('basic_newsletter') || '[]');
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem('basic_newsletter', JSON.stringify(emails));
    }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#0b0b0b] border-t border-white/5 pt-20 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 pb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-6">
          <Link href="/" className="text-2xl font-bold tracking-[0.25em] cursor-none">
            BASIC
          </Link>
          <p className="text-white/50 text-xs font-light leading-relaxed max-w-sm">
            Minimal everyday essentials engineered for modern aesthetics. Built with sustainable craftsmanship and luxury materials.
          </p>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-white/30 block">
              Subscribe to our Capsule releases
            </span>
            {subscribed ? (
              <p className="text-xs text-white/90 font-light tracking-wider uppercase animate-fade-in">
                Thank you for subscribing.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-sm border-b border-white/20 pb-1.5 focus-within:border-white transition-colors">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none placeholder-white/35 font-light uppercase tracking-wider"
                  required
                />
                <button type="submit" className="p-1 hover:translate-x-1 transition-transform cursor-none">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-widest text-white/80 font-medium">Collections</h5>
          <div className="flex flex-col space-y-2.5 text-xs text-white/50 font-light">
            <Link href="/shop?collection=Essentials" className="hover:text-white transition-colors cursor-none">Essentials</Link>
            <Link href="/shop?collection=Oversized" className="hover:text-white transition-colors cursor-none">Oversized</Link>
            <Link href="/shop?category=Hoodies" className="hover:text-white transition-colors cursor-none">Heavyweight Hoodies</Link>
            <Link href="/shop?collection=Limited+Edition" className="hover:text-white transition-colors cursor-none">Limited Edition</Link>
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-widest text-white/80 font-medium">Customer Support</h5>
          <div className="flex flex-col space-y-2.5 text-xs text-white/50 font-light">
            <Link href="#" className="hover:text-white transition-colors cursor-none">Shipping & Handling</Link>
            <Link href="#" className="hover:text-white transition-colors cursor-none">Return Policy</Link>
            <Link href="#" className="hover:text-white transition-colors cursor-none">Size Advisor</Link>
            <Link href="#" className="hover:text-white transition-colors cursor-none">Contact Support</Link>
          </div>
        </div>

        {/* Links Column 3 */}
        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-widest text-white/80 font-medium">Social Matrix</h5>
          <div className="flex flex-col space-y-2.5 text-xs text-white/50 font-light">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors cursor-none">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors cursor-none">Pinterest</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors cursor-none">TikTok</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors cursor-none">Twitter</a>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-white/30 tracking-widest uppercase gap-4">
        <span>© {new Date().getFullYear()} BASIC CLOTHING INC. ALL RIGHTS RESERVED.</span>
        
        {/* Payment Icons */}
        <div className="flex items-center space-x-4">
          <span>Razorpay</span>
          <span>•</span>
          <span>PayPal</span>
          <span>•</span>
          <span>Stripe Ready</span>
        </div>
      </div>
    </footer>
  );
}
