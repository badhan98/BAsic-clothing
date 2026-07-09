'use client';

import { useState, useEffect } from 'react';
import { db, LookbookItem, Product } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Lookbook() {
  const [lookbooks, setLookbooks] = useState<LookbookItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const looks = await db.getLookbooks();
      const prods = await db.getProducts();
      setLookbooks(looks);
      setProducts(prods);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/20 font-light tracking-widest text-sm animate-pulse">LOADING LOOKBOOKS...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white">
      {lookbooks.map((look, idx) => {
        // Filter products featured in this look
        const featuredProds = products.filter(p => look.featuredProductIds.includes(p.id));

        return (
          <section
            key={look.id}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden border-b border-white/5"
          >
            {/* Background Image with Parallax & Color overlay */}
            <div className="absolute inset-0 bg-[#080808]">
              <img
                src={look.imageUrl}
                alt={look.title}
                className="w-full h-full object-cover filter grayscale contrast-125 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60" />
            </div>

            {/* Layout Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-between py-24 select-none">
              
              {/* Slide Header */}
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                  Capsule Edition 0{idx + 1}
                </span>
                <span className="text-xs font-light text-white/40 font-mono">
                  [0{idx + 1} / 0{lookbooks.length}]
                </span>
              </div>

              {/* Title & Description */}
              <div className="max-w-xl space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">
                    {look.category}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-none">
                    {look.title}
                  </h2>
                </motion.div>
                <p className="text-xs md:text-sm text-white/50 font-light leading-relaxed">
                  {look.description}
                </p>
              </div>

              {/* Featured Products Quick Buy */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-6 border-t border-white/10">
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 block">Featured Garments</span>
                  <div className="flex flex-wrap gap-4">
                    {featuredProds.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 flex items-center space-x-3 hover:bg-white hover:text-black transition-all cursor-none group"
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-[10px] uppercase tracking-wider font-medium text-white group-hover:text-black transition-colors">
                            {prod.name}
                          </h4>
                          <span className="text-[9px] font-light text-white/55 group-hover:text-black/60 transition-colors">
                            ${prod.basePrice.toFixed(2)}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Arrow down action */}
                {idx < lookbooks.length - 1 && (
                  <span className="text-[9px] uppercase tracking-widest text-white/30 hidden md:inline-block animate-bounce">
                    Scroll down for next volume
                  </span>
                )}
              </div>

            </div>
          </section>
        );
      })}
    </div>
  );
}
