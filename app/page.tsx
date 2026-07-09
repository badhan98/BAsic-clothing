'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, ChevronRight, Play, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { DynamicFabricScene } from '@/components/canvas/dynamic-fabric-scene';
import MagneticButton from '@/components/magnetic-button';
import { useState, useEffect } from 'react';
import { db, Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import InstagramFeed from '@/components/instagram-feed';


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await db.getProducts();
      setFeaturedProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = ['All', 'Hoodies', 'Polo Shirts', 'T-Shirts', 'Sweatshirts', 'Jackets'];

  const filteredProducts = selectedCategory === 'All'
    ? featuredProducts.slice(0, 4)
    : featuredProducts.filter(p => p.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      
      {/* 1. ANIMATED HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* R3F Dynamic Silk Fabric Canvas Background */}
        <DynamicFabricScene />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-[1]" />
        <div className="absolute inset-0 bg-black/25 z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center flex flex-col items-center select-none pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-[0.45em] text-white/50 block">
              BASIC CLOTHING CO.
            </span>
            <h1 className="text-5xl md:text-[8rem] font-bold tracking-tighter text-white uppercase leading-none">
              WEAR LESS.<br className="md:hidden" /> FEEL MORE.
            </h1>
            <p className="text-sm md:text-lg text-white/60 font-light tracking-wide max-w-lg mx-auto leading-relaxed pt-2">
              Premium everyday essentials crafted for modern living. Designed in New York.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full max-w-md"
          >
            <MagneticButton strength={0.25} className="w-full sm:w-auto">
              <Link
                href="/shop"
                className="block text-center bg-white text-black px-10 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg"
              >
                Shop Collection
              </Link>
            </MagneticButton>

            <MagneticButton strength={0.25} className="w-full sm:w-auto">
              <Link
                href="/lookbook"
                className="block text-center border border-white/20 text-white px-10 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Explore Lookbook
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll Mouse Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-2 opacity-50"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-light">Scroll Down</span>
          <ArrowDown className="w-3.5 h-3.5 stroke-1" />
        </motion.div>
      </section>

      {/* 2. SCROLL STORYTELLING EDITORIAL REVEALS */}
      <section className="py-32 max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-40">
        
        {/* Story Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-6"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">THE PHILOSOPHY</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight uppercase">
              Sculptured Fabrics.<br />Perfected Silhouette.
            </h2>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light max-w-md">
              We strip away all unnecessary details: no loud logos, zero drawstrings, and hidden pockets. Every garment represents a masterclass in geometry, texture, and structural posture.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="group flex items-center space-x-2 text-xs uppercase tracking-widest hover:text-white/60 transition-colors cursor-none">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative h-[450px] md:h-[600px] w-full bg-[#101010] overflow-hidden group border border-white/5"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Luxury Fabric Detail"
              className="w-full h-full object-cover hover-image-zoom filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>
        </div>

        {/* Story Block 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative h-[450px] md:h-[600px] w-full bg-[#101010] overflow-hidden group border border-white/5 md:order-2"
          >
            <img
              src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop"
              alt="Luxury Outerwear Portrait"
              className="w-full h-full object-cover hover-image-zoom filter grayscale"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-6 md:order-1"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">THE SOURCE</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight uppercase">
              Uncompromising<br />Materials.
            </h2>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light max-w-md">
              From long-staple Supima cotton picked in California to recycled wool blends processed in Italian mills, our materials are selected for longevity, durability, and a premium skin feel.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="group flex items-center space-x-2 text-xs uppercase tracking-widest hover:text-white/60 transition-colors cursor-none">
                <span>Source Book</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

      </section>

      {/* 3. FEATURED COLLECTION SECTION */}
      <section className="py-24 bg-[#0b0b0b] relative z-10 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">CURATED CAPSULES</span>
              <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-tight">FEATURED GARMENTS</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-[10px] uppercase tracking-widest border transition-all cursor-none ${
                    selectedCategory === cat
                      ? 'bg-white text-black border-white font-medium'
                      : 'bg-transparent text-white/60 border-white/10 hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] w-full bg-[#101010]" />
                  <div className="h-4 bg-[#101010] w-2/3" />
                  <div className="h-3 bg-[#101010] w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedCategory}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group relative flex flex-col space-y-4"
                >
                  {/* Product Card Media Container */}
                  <div className="aspect-[3/4] w-full bg-[#101010] relative overflow-hidden border border-white/5">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quick View Button */}
                    <div className="absolute inset-0 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Link
                        href={`/product/${product.slug}`}
                        className="bg-white text-black p-3 rounded-full hover:bg-white/80 transition-colors cursor-none"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="bg-black/60 border border-white/20 text-white p-3 rounded-full hover:bg-white hover:text-black transition-colors cursor-none"
                        title="Add to Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Featured / Collection Label */}
                    <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-light text-white">
                      {product.collection}
                    </span>
                  </div>

                  {/* Product Card Text Metadata */}
                  <div className="flex justify-between items-start pt-1">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium tracking-wide text-white/90">
                        <Link href={`/product/${product.slug}`} className="cursor-none hover:text-white/60 transition-colors">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-white/40 font-light">{product.category}</p>
                    </div>
                    <span className="text-sm font-light text-white/80">${product.basePrice.toFixed(2)}</span>
                  </div>

                  {/* Quick Add trigger */}
                  <button
                    onClick={() => addToCart(product, product.colors[0], product.sizes[0], 1)}
                    className="w-full border border-white/10 py-2.5 text-[10px] uppercase tracking-widest font-light hover:bg-white hover:text-black hover:border-white transition-all cursor-none"
                  >
                    Quick Add to Cart
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. MAGAZINE LOOKBOOK PREVIEW */}
      <section className="py-32 max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">EDITORIAL VOLUME</span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
              THE<br />LOOKBOOK
            </h2>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light">
              Explore our cinematic lookbook magazine. Captured in architectural concrete frames, showcasing the seasonal transitions of the BASIC wardrobe.
            </p>
            <div className="pt-4">
              <MagneticButton strength={0.2}>
                <Link
                  href="/lookbook"
                  className="inline-flex items-center space-x-3 bg-white text-black px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-white/80 transition-colors cursor-none"
                >
                  <span>Explore Lookbook</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Right Large Hero Landscape */}
          <div className="lg:col-span-8 relative h-[350px] md:h-[500px] w-full bg-[#101010] overflow-hidden border border-white/5 group">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial lookbook cover"
              className="w-full h-full object-cover hover-image-zoom filter grayscale contrast-110"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-8 left-8 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-white/60">Capsule 02</span>
              <h4 className="text-lg font-medium tracking-wide">Vol 02. Essential Comforts</h4>
            </div>
          </div>

        </div>
      </section>

      {/* 5. LUXURY CAROUSEL TESTIMONIALS */}
      <section className="py-24 bg-[#0b0b0b] relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">TESTIMONY</span>
            <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-tight">VERIFIED CONFIDENCE</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#101010]/60 backdrop-blur-md border border-white/5 p-8 space-y-6 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed italic">
                &quot;The weight of the 500GSM hoodie is incredible. It hangs perfectly off the shoulders, retaining its boxy structural drape. No loose threads, and after three washes it looks brand new.&quot;
              </p>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-white/90">Marcus G.</h4>
                <span className="text-[9px] uppercase tracking-widest text-white/40 block mt-0.5">Verified Buyer</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#101010]/60 backdrop-blur-md border border-white/5 p-8 space-y-6 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed italic">
                &quot;Minimalism done right. The fit and materials are top notch. I replaced my entire t-shirt drawer with BASIC\'s Supima Tees. The skin comfort is second to none.&quot;
              </p>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-white/90">Julian P.</h4>
                <span className="text-[9px] uppercase tracking-widest text-white/40 block mt-0.5">Verified Buyer</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#101010]/60 backdrop-blur-md border border-white/5 p-8 space-y-6 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed italic">
                &quot;I am in love with the pleated joggers. They look tailored enough for casual office days, but feel like lounge sweatpants. A masterpiece of design.&quot;
              </p>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-white/90">Sofia R.</h4>
                <span className="text-[9px] uppercase tracking-widest text-white/40 block mt-0.5">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTAGRAM MASONRY MATRIX */}
      <InstagramFeed />

    </div>
  );
}
