'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { db, Product, Review } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Heart, Star, ChevronDown, Check, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
  const { slug } = useParams() as { slug: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Selector States
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'reviews'>('details');

  // 360 Viewer State
  const [is360Mode, setIs360Mode] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const dragStartRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Review Form State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Store actions
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const addRecentlyViewed = useStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await db.getProductBySlug(slug);
      if (data) {
        setProduct(data);
        setSelectedColor(data.colors[0]);
        setSelectedSize(data.sizes[0]);
        // Seed recently viewed
        addRecentlyViewed(data);
        
        // Fetch reviews
        const revList = await db.getReviews(data.id);
        setReviews(revList);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/20 font-light tracking-widest text-sm animate-pulse">LOADING PRODUCT DETAILS...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl uppercase font-light text-white/50">Garment Not Found</h2>
        <Link href="/shop" className="border border-white/20 px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Get active images based on selected color
  const activeColorImages = product.images.filter(img => img.color === selectedColor?.name);
  const galleryImages = activeColorImages.length > 0 ? activeColorImages : product.images;

  // 360 Spin Drag Handlers (Simulated 360 using product images sequence)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartRef.current;
    if (Math.abs(diff) > 15) {
      const direction = diff > 0 ? 1 : -1;
      setFrameIndex((prevIndex) => {
        let next = prevIndex + direction;
        if (next < 0) next = galleryImages.length - 1;
        if (next >= galleryImages.length) next = 0;
        return next;
      });
      dragStartRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Submit Review Form Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    const newRev = await db.submitReview({
      productId: product.id,
      userName: reviewAuthor,
      rating: reviewRating,
      title: reviewTitle || 'Excellent Quality',
      comment: reviewComment
    });

    setReviews([newRev, ...reviews]);
    setReviewSuccess(true);
    setReviewTitle('');
    setReviewComment('');
    setReviewAuthor('');
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  return (
    <div className="pt-28 pb-32 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-white/30 mb-8">
          <Link href="/" className="hover:text-white transition-colors cursor-none">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors cursor-none">Shop</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Gallery & 360 Viewer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Viewer Toggle */}
            <div className="flex space-x-4 border-b border-white/5 pb-3">
              <button
                onClick={() => setIs360Mode(false)}
                className={`text-[10px] uppercase tracking-widest pb-1 transition-all cursor-none ${
                  !is360Mode ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'
                }`}
              >
                Gallery View
              </button>
              <button
                onClick={() => setIs360Mode(true)}
                className={`text-[10px] uppercase tracking-widest pb-1 transition-all cursor-none ${
                  is360Mode ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'
                }`}
              >
                360° Rotational Viewer
              </button>
            </div>

            {is360Mode ? (
              /* Drag-to-Rotate 360 container */
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="aspect-[3/4] w-full bg-[#101010] relative flex items-center justify-center border border-white/5 select-none active:cursor-grabbing cursor-grab"
              >
                <img
                  src={galleryImages[frameIndex]?.url || product.images[0].url}
                  alt={`${product.name} frame`}
                  className="w-full h-full object-cover pointer-events-none filter grayscale contrast-110"
                />
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/70 pointer-events-none">
                  Drag left/right to rotate 360°
                </div>
              </div>
            ) : (
              /* Regular Image Gallery */
              <div className="space-y-4">
                <div className="aspect-[3/4] w-full bg-[#101010] border border-white/5 relative group overflow-hidden">
                  <img
                    src={galleryImages[activeImageIndex]?.url || product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] filter grayscale contrast-110 hover:scale-105"
                  />
                  <span className="absolute bottom-6 right-6 bg-black/60 border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-widest font-light text-white">
                    Frame {activeImageIndex + 1} / {galleryImages.length}
                  </span>
                </div>

                {/* Thumbnails */}
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-24 bg-[#101010] flex-shrink-0 border transition-all cursor-none overflow-hidden ${
                        activeImageIndex === idx ? 'border-white' : 'border-white/5 hover:border-white/30'
                      }`}
                    >
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-cover filter grayscale" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Buying Settings Panel */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            
            {/* Title & Metadata */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-white/50 block">
                {product.collection} / {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-xl font-light text-white/95">${product.basePrice.toFixed(2)}</span>
                <span className="text-white/20">|</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span className="text-xs font-light text-white/80">{product.rating}</span>
                  <span className="text-xs text-white/40">({product.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Swatch Selectors */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-white/40 block">
                Color: {selectedColor?.name}
              </span>
              <div className="flex space-x-3">
                {product.colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setSelectedColor(c);
                      setActiveImageIndex(0);
                    }}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-none ${
                      selectedColor?.hex === c.hex ? 'border-white scale-110' : 'border-white/10 hover:border-white/40'
                    }`}
                    style={{ backgroundColor: c.hex === '#FFFFFF' ? '#F5F5F0' : c.hex }}
                    title={c.name}
                  >
                    {selectedColor?.hex === c.hex && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#F5F5F0' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selectors */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                <span>Select Size</span>
                <button
                  onClick={() => setActiveTab('sizing')}
                  className="underline hover:text-white transition-colors cursor-none"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 text-xs border transition-all cursor-none min-w-[3.5rem] text-center ${
                      selectedSize === sz
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/40'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => {
                  addToCart(product, selectedColor, selectedSize, quantity);
                  // Open Drawer by triggering standard zustand trigger
                  const cartDrawerOpenTrigger = document.querySelector('[data-cart-drawer-trigger]') as HTMLButtonElement;
                  if (cartDrawerOpenTrigger) cartDrawerOpenTrigger.click();
                }}
                className="flex-1 bg-white text-black py-4 text-xs font-semibold uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 cursor-none"
              >
                <span>Add to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="border border-white/10 px-4 py-4 hover:border-white transition-all cursor-none"
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Delivery/Warranty info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-[9px] text-white/40 uppercase tracking-widest font-light">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="w-4 h-4 stroke-1 text-white/60" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RotateCcw className="w-4 h-4 stroke-1 text-white/60" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-4 h-4 stroke-1 text-white/60" />
                <span>Secure Checkout</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: Tabs & Reviews */}
        <div className="mt-28 border-t border-white/5 pt-12">
          {/* Tab Headers */}
          <div className="flex space-x-8 border-b border-white/5 pb-4 mb-8">
            {['details', 'sizing', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-xs uppercase tracking-widest pb-1 transition-all cursor-none ${
                  activeTab === tab ? 'text-white font-medium border-b border-white' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab === 'details' ? 'Fabric & Details' : tab === 'sizing' ? 'Fit & Sizing' : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs md:text-sm font-light text-white/50 leading-relaxed"
            >
              <div className="space-y-4">
                <h4 className="text-white text-xs uppercase tracking-widest font-medium">Fabric Properties</h4>
                <p>{product.fabricDetails}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-white text-xs uppercase tracking-widest font-medium">Design Notes</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Reinforced bindings at cuffs and neck collar.</li>
                  <li>Invisible pocket alignment for structural posture.</li>
                  <li>Pre-shrunk to retain shapes and volumes.</li>
                  <li>Ethically made in New York mills.</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Sizing */}
          {activeTab === 'sizing' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs md:text-sm font-light text-white/50 leading-relaxed"
            >
              <div className="space-y-4">
                <h4 className="text-white text-xs uppercase tracking-widest font-medium">Fit Recommendations</h4>
                <p>{product.fitRecommendation}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-white text-xs uppercase tracking-widest font-medium">Measurements Chart (inches)</h4>
                <table className="w-full text-[11px] uppercase tracking-wider text-left border-collapse border border-white/10 text-white/60">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-2.5 border border-white/10">Size</th>
                      <th className="p-2.5 border border-white/10">Chest</th>
                      <th className="p-2.5 border border-white/10">Sleeve</th>
                      <th className="p-2.5 border border-white/10">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 border border-white/10 font-medium text-white">S</td>
                      <td className="p-2.5 border border-white/10">36 - 38</td>
                      <td className="p-2.5 border border-white/10">33.5</td>
                      <td className="p-2.5 border border-white/10">27.5</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="p-2.5 border border-white/10 font-medium text-white">M</td>
                      <td className="p-2.5 border border-white/10">39 - 41</td>
                      <td className="p-2.5 border border-white/10">34.2</td>
                      <td className="p-2.5 border border-white/10">28.3</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-white/10 font-medium text-white">L</td>
                      <td className="p-2.5 border border-white/10">42 - 44</td>
                      <td className="p-2.5 border border-white/10">35.0</td>
                      <td className="p-2.5 border border-white/10">29.1</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="p-2.5 border border-white/10 font-medium text-white">XL</td>
                      <td className="p-2.5 border border-white/10">45 - 47</td>
                      <td className="p-2.5 border border-white/10">35.8</td>
                      <td className="p-2.5 border border-white/10">30.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Reviews List */}
              <div className="lg:col-span-8 space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-xs text-white/40 font-light">Be the first to review this product.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-white/5 pb-6 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-white/90">{rev.userName}</span>
                          <span className="text-[10px] text-white/30">•</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-white text-white' : 'text-white/15'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-white/30">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h5 className="text-xs font-medium text-white/80">{rev.title}</h5>
                      <p className="text-xs text-white/50 font-light leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Input Form */}
              <div className="lg:col-span-4 bg-[#101010] p-6 border border-white/5 h-fit space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold">Write Review</h4>
                {reviewSuccess ? (
                  <p className="text-xs text-white/80 font-light uppercase tracking-wider animate-pulse">
                    Review submitted successfully.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-white/50 block">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white font-light focus:outline-none"
                      >
                        <option value={5}>5 Stars - Perfect</option>
                        <option value={4}>4 Stars - Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Unusable</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/50 block">Your Name</label>
                      <input
                        type="text"
                        placeholder="ENTER YOUR NAME"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white font-light uppercase focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/50 block">Review Title</label>
                      <input
                        type="text"
                        placeholder="SUMMARIZE YOUR EXPERIENCE"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white font-light uppercase focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white/50 block">Review Comment</label>
                      <textarea
                        placeholder="SHARE WHAT YOU LIKE OR DISLIKE ABOUT THIS GARMENT"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white font-light uppercase h-24 focus:outline-none resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-black py-2.5 uppercase font-medium tracking-widest hover:bg-white/80 transition-colors cursor-none"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
