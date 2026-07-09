'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db, Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { Heart, Eye, SlidersHorizontal, Grid, X } from 'lucide-react';

function ShopCatalog() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(350);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Store Integration
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const addToCart = useStore((state) => state.addToCart);

  // Extract query params from URL if any
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const collectionParam = searchParams.get('collection');
    const searchParam = searchParams.get('search');

    if (categoryParam) setSelectedCategory(categoryParam);
    if (collectionParam) setSelectedCollection(collectionParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Load Products
  useEffect(() => {
    const loadData = async () => {
      const data = await db.getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...products];

    // Filter by Wishlist ONLY if URL specifies ?wishlist=true
    const wishlistOnly = searchParams.get('wishlist') === 'true';
    if (wishlistOnly) {
      result = result.filter(p => isInWishlist(p.id));
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Collection Filter
    if (selectedCollection !== 'All') {
      result = result.filter(p => p.collection.toLowerCase() === selectedCollection.toLowerCase());
    }

    // Size Filter
    if (selectedSize !== 'All') {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // Color Filter
    if (selectedColor !== 'All') {
      result = result.filter(p => p.colors.some(c => c.name.toLowerCase() === selectedColor.toLowerCase()));
    }

    // Price Filter
    result = result.filter(p => p.basePrice <= priceRange);

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedCollection, selectedSize, selectedColor, priceRange, searchQuery, sortBy, searchParams, isInWishlist]);

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];
  const colors = ['All', 'Black', 'Off-White', 'Charcoal', 'Olive', 'Grey', 'Taupe'];

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setPriceRange(350);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="pt-28 pb-20 bg-[#050505] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Title */}
        <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Garment Catalog</span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {searchParams.get('wishlist') === 'true' ? 'Your Wishlist' : 'Shop Collections'}
            </h1>
          </div>
          <span className="text-xs text-white/40 tracking-wider font-light uppercase">
            Showing {filteredProducts.length} results
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* 1. FILTER SIDEBAR (Desktop) */}
          <aside className="hidden lg:block space-y-10 pr-6 border-r border-white/5">
            {/* Search */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-medium text-white/90">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="SEARCH CATALOG"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-xs px-3 py-2.5 font-light uppercase tracking-wider focus:outline-none focus:border-white transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-medium text-white/90">Categories</h4>
              <div className="flex flex-col space-y-2 text-xs font-light text-white/50">
                {['All', 'Hoodies', 'Polo Shirts', 'T-Shirts', 'Sweatshirts', 'Jackets', 'Joggers'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left hover:text-white transition-colors cursor-none ${
                      selectedCategory === cat ? 'text-white font-medium pl-2 border-l border-white' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-medium text-white/90">Collections</h4>
              <div className="flex flex-col space-y-2 text-xs font-light text-white/50">
                {['All', 'New Arrivals', 'Essentials', 'Oversized', 'Summer', 'Winter'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`text-left hover:text-white transition-colors cursor-none ${
                      selectedCollection === col ? 'text-white font-medium pl-2 border-l border-white' : ''
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-medium text-white/90">Sizes</h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 text-[10px] border transition-all cursor-none ${
                      selectedSize === sz
                        ? 'bg-white text-black border-white font-medium'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/40'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-medium text-white/90">Colors</h4>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 text-[10px] uppercase border transition-all cursor-none ${
                      selectedColor === col
                        ? 'bg-white text-black border-white font-medium'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/40'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs uppercase tracking-widest font-medium">
                <span className="text-white/90">Max Price</span>
                <span>${priceRange}</span>
              </div>
              <input
                type="range"
                min={30}
                max={350}
                step={5}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-white cursor-none"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="w-full border border-white/20 py-2.5 text-[10px] uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all cursor-none"
            >
              Reset All Filters
            </button>
          </aside>

          {/* 2. CATALOG MAIN BODY */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Sorting & Mobile Filter Toggle */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden flex items-center space-x-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors cursor-none"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="hidden lg:flex items-center space-x-2 text-white/40 text-xs font-light">
                <Grid className="w-4 h-4 text-white" />
                <span>Default Grid View</span>
              </div>

              {/* Sorting Selection */}
              <div className="flex items-center space-x-2 text-xs font-light">
                <span className="text-white/40 uppercase tracking-wider">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-white/10 text-white px-2 py-1.5 focus:outline-none focus:border-white transition-colors cursor-none text-[11px] uppercase tracking-wider"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Popularity</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-[3/4] w-full bg-[#101010]" />
                    <div className="h-4 bg-[#101010] w-2/3" />
                    <div className="h-3 bg-[#101010] w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <p className="text-white/40 font-light tracking-wide text-sm">
                  No garments match your active selection criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="border border-white/20 px-6 py-2.5 text-[10px] uppercase tracking-widest font-light hover:bg-white hover:text-black transition-colors cursor-none"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col space-y-4">
                    <div className="aspect-[3/4] w-full bg-[#101010] relative overflow-hidden border border-white/5">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Action Links */}
                      <div className="absolute inset-0 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <Link
                          href={`/product/${product.slug}`}
                          className="bg-white text-black p-3 rounded-full hover:bg-white/80 transition-colors cursor-none"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="bg-black/60 border border-white/20 text-white p-3 rounded-full hover:bg-white hover:text-black transition-colors cursor-none"
                        >
                          <Heart
                            className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Tag */}
                      <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-light text-white">
                        {product.collection}
                      </span>
                    </div>

                    {/* Metadata */}
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

                    {/* Quick Add */}
                    <button
                      onClick={() => addToCart(product, product.colors[0], product.sizes[0], 1)}
                      className="w-full border border-white/10 py-2.5 text-[10px] uppercase tracking-widest font-light hover:bg-white hover:text-black hover:border-white transition-all cursor-none"
                    >
                      Quick Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS SIDEBAR OVERLAY */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-[210] flex lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-[#0b0b0b] p-6 text-white flex flex-col justify-between overflow-y-auto z-10 border-l border-white/10">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-semibold uppercase tracking-widest">Filter Options</span>
                <button onClick={() => setShowFiltersMobile(false)}>
                  <X className="w-5 h-5 text-white/60 hover:text-white" />
                </button>
              </div>

              {/* Search */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-medium text-white/80">Search</h4>
                <input
                  type="text"
                  placeholder="SEARCH CATALOG"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-xs px-3 py-2 font-light text-white uppercase tracking-wider"
                />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-medium text-white/80">Categories</h4>
                <div className="flex flex-col space-y-2 text-xs font-light text-white/50">
                  {['All', 'Hoodies', 'Polo Shirts', 'T-Shirts', 'Sweatshirts', 'Jackets'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left hover:text-white ${selectedCategory === cat ? 'text-white font-medium' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-medium text-white/80">Sizes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-[10px] border transition-all ${
                        selectedSize === sz ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                resetFilters();
                setShowFiltersMobile(false);
              }}
              className="w-full border border-white/20 py-2.5 text-[10px] uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all cursor-none mt-8"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/20 font-light tracking-widest text-sm animate-pulse">
          LOADING CATALOG...
        </div>
      </div>
    }>
      <ShopCatalog />
    </Suspense>
  );
}
