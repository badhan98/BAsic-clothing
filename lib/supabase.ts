import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize actual Supabase client conditionally
export const supabase = 
  SUPABASE_URL && SUPABASE_ANON_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Premium Pre-seeded Mock Data
export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  color: string;
  url: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: string;
  collection: string;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: ProductColor[];
  images: ProductImage[];
  fitRecommendation: string;
  fabricDetails: string;
  videoUrl?: string;
  isFeatured?: boolean;
}

export interface LookbookItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  featuredProductIds: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

export const MOCK_CATEGORIES = ['Hoodies', 'Polo Shirts', 'T-Shirts', 'Sweatshirts', 'Jackets', 'Joggers', 'Shorts'];
export const MOCK_COLLECTIONS = ['New Arrivals', 'Essentials', 'Oversized', 'Summer', 'Winter', 'Limited Edition'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Oversized Heavyweight Hoodie',
    slug: 'oversized-heavyweight-hoodie',
    description: 'An ultra-thick 500GSM organic cotton hoodie. Designed with a relaxed drop-shoulder silhouette, double-lined hood, and zero drawstrings for a clean, architectural shape.',
    basePrice: 120.00,
    category: 'Hoodies',
    collection: 'Oversized',
    rating: 4.9,
    reviewCount: 148,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#2A2A2A' },
      { name: 'Off-White', hex: '#F5F5F0' },
      { name: 'Pitch Black', hex: '#0D0D0D' }
    ],
    images: [
      { color: 'Charcoal', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop', isPrimary: true },
      { color: 'Off-White', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop' },
      { color: 'Pitch Black', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop' }
    ],
    fitRecommendation: 'Fits true to size for a premium oversized look. Size down if you prefer a closer, traditional fit.',
    fabricDetails: '100% Organic Heavyweight Cotton. 500GSM loopback French terry. Pre-shrunk to retain structural drape after multiple washes.',
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: 'Mercerized Cotton Polo',
    slug: 'mercerized-cotton-polo',
    description: 'Elevated luxury polo shirt crafted from double-mercerized long-staple cotton for a subtle, liquid-like sheen. Features a hidden placket and tailored knit collar.',
    basePrice: 85.00,
    category: 'Polo Shirts',
    collection: 'Essentials',
    rating: 4.8,
    reviewCount: 92,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Off-White', hex: '#F5F5F0' },
      { name: 'Olive Drab', hex: '#3E4238' },
      { name: 'Pitch Black', hex: '#0D0D0D' }
    ],
    images: [
      { color: 'Off-White', url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop', isPrimary: true },
      { color: 'Olive Drab', url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop' },
      { color: 'Pitch Black', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop' }
    ],
    fitRecommendation: 'Slim, clean profile. If you have broad shoulders, we recommend ordering one size up.',
    fabricDetails: '95% Double Mercerized Supima Cotton, 5% Lycra. Hand-wash or dry clean recommended to retain finish.',
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: 'Supima Minimalist Tee',
    slug: 'supima-minimalist-tee',
    description: 'The foundation of the modern wardrobe. Engineered with 100% long-staple Supima cotton, featuring a fine-rib crewneck, reinforced seams, and a beautifully draped cut.',
    basePrice: 45.00,
    category: 'T-Shirts',
    collection: 'Essentials',
    rating: 4.7,
    reviewCount: 312,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Off-White', hex: '#F5F5F0' },
      { name: 'Heather Grey', hex: '#9E9E9E' },
      { name: 'Pitch Black', hex: '#0D0D0D' }
    ],
    images: [
      { color: 'Off-White', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', isPrimary: true },
      { color: 'Heather Grey', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop' },
      { color: 'Pitch Black', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop' }
    ],
    fitRecommendation: 'Regular fit. Take your standard size. Designed to hold shape after infinite washes.',
    fabricDetails: '100% US-grown Supima Cotton. 220GSM single-jersey. Extremely soft, breathable, and highly durable.',
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'Scuba Structural Sweatshirt',
    slug: 'scuba-structural-sweatshirt',
    description: 'A structured, high-tech sweatshirt made from double-knit spacer fabric. Features an architectural drape, invisible side-seam pockets, and soft bonded hems.',
    basePrice: 110.00,
    category: 'Sweatshirts',
    collection: 'New Arrivals',
    rating: 4.9,
    reviewCount: 64,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Taupe', hex: '#BCAAA4' },
      { name: 'Pitch Black', hex: '#0D0D0D' }
    ],
    images: [
      { color: 'Taupe', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', isPrimary: true },
      { color: 'Pitch Black', url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop' }
    ],
    fitRecommendation: 'True to size. Offers a clean, architectural silhouette that holds its shape away from the body.',
    fabricDetails: '78% Rayon, 15% Polyester, 7% Spandex. Luxury spacer-knit. Machine wash cold on delicate cycle.',
    isFeatured: false
  },
  {
    id: 'prod-5',
    name: 'Minimalist Recycled Wool Jacket',
    slug: 'minimalist-recycled-wool-jacket',
    description: 'Tailored luxury outerwear. Crafted from a premium recycled wool blend, featuring an elegant concealed double zip closure, structured collar, and internal satin linings.',
    basePrice: 295.00,
    category: 'Jackets',
    collection: 'Limited Edition',
    rating: 4.9,
    reviewCount: 41,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#2A2A2A' },
      { name: 'Pitch Black', hex: '#0D0D0D' }
    ],
    images: [
      { color: 'Charcoal', url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop', isPrimary: true },
      { color: 'Pitch Black', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop' }
    ],
    fitRecommendation: 'Tailored fit. Relaxed underarms to allow comfortable layering over sweaters or hoodies.',
    fabricDetails: '75% Recycled Wool, 20% Nylon, 5% Cashmere. Lining: 100% Cupro. Professional dry clean only.',
    isFeatured: true
  },
  {
    id: 'prod-6',
    name: 'Pleated Minimal Joggers',
    slug: 'pleated-minimal-joggers',
    description: 'Redefining leisurewear. Tailored sweatpants featuring a permanent pressed front pleat, zipped pockets, elasticated waistband, and custom hidden drawstrings.',
    basePrice: 95.00,
    category: 'Joggers',
    collection: 'Essentials',
    rating: 4.6,
    reviewCount: 118,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#2A2A2A' },
      { name: 'Off-White', hex: '#F5F5F0' }
    ],
    images: [
      { color: 'Charcoal', url: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=800&auto=format&fit=crop', isPrimary: true },
      { color: 'Off-White', url: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop' }
    ],
    fitRecommendation: 'Tailored, tapered fit. Go one size up for a more relaxed, loose-fitting drape.',
    fabricDetails: '100% Cotton French Terry. 380GSM. Rib-knit cuffs with reinforced Lycra elastic.',
    isFeatured: false
  }
];

export const MOCK_LOOKBOOKS: LookbookItem[] = [
  {
    id: 'look-1',
    title: 'Vol 01. The Art of Solitude',
    description: 'An exploration of monochrome tones and structural shapes set against architectural concrete landscapes.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    category: 'Editorial',
    featuredProductIds: ['prod-1', 'prod-3']
  },
  {
    id: 'look-2',
    title: 'Vol 02. Essential Comforts',
    description: 'Redefining the everyday wardrobe with double-mercerized fabrics and soft drapes built for modern living.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    category: 'Studio',
    featuredProductIds: ['prod-2', 'prod-6']
  },
  {
    id: 'look-3',
    title: 'Vol 03. Heavyweight Textures',
    description: 'A study on thick 500GSM weaves, recyled cashmere, and structured outerwear designed to withstand cold climates.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    category: 'Winter Capsule',
    featuredProductIds: ['prod-4', 'prod-5']
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Alexander M.',
    rating: 5,
    title: 'Absolute Masterpiece',
    comment: 'The weight of this hoodie is unbelievable. It holds its shape perfectly and doesn\'t collapse. Better than hoodies I\'ve paid triple the price for. Highly recommended.',
    helpfulCount: 24,
    createdAt: '2026-06-15T08:30:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Clara V.',
    rating: 5,
    title: 'Perfect Architectural Drape',
    comment: 'No drawstrings make it look so clean. The neck is nice and structured. Pitch black is incredibly deep and doesn\'t fade in the wash.',
    helpfulCount: 18,
    createdAt: '2026-06-20T14:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Devon K.',
    rating: 4,
    title: 'Extremely Soft, Runs Slim',
    comment: 'The mercerized shine is beautiful. Looks very expensive. Runs a bit slim across the shoulders, so size up if you prefer a bit of room.',
    helpfulCount: 9,
    createdAt: '2026-07-01T10:05:00Z'
  }
];

// Dual-Mode Database Client Implementation
export const db = {
  // Products
  async getProducts(): Promise<Product[]> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) return data.map(p => this.mapDBProduct(p));
    }
    // Check LocalStorage override
    const local = localStorage.getItem('basic_products');
    if (local) return JSON.parse(local);
    return MOCK_PRODUCTS;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error && data) return this.mapDBProduct(data);
    }
    const products = await this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  // Categories & Collections
  async getCategories(): Promise<string[]> {
    return MOCK_CATEGORIES;
  },

  async getCollections(): Promise<string[]> {
    return MOCK_COLLECTIONS;
  },

  // Lookbook
  async getLookbooks(): Promise<LookbookItem[]> {
    return MOCK_LOOKBOOKS;
  },

  // Reviews
  async getReviews(productId: string): Promise<Review[]> {
    const local = localStorage.getItem(`basic_reviews_${productId}`);
    if (local) return JSON.parse(local);
    return MOCK_REVIEWS.filter(r => r.productId === productId);
  },

  async submitReview(review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    const key = `basic_reviews_${review.productId}`;
    const existing = await this.getReviews(review.productId);
    const updated = [newReview, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    // Update Product stats in mock database
    const products = await this.getProducts();
    const targetProduct = products.find(p => p.id === review.productId);
    if (targetProduct) {
      const totalRating = existing.reduce((sum, r) => sum + r.rating, 0) + review.rating;
      targetProduct.reviewCount += 1;
      targetProduct.rating = parseFloat((totalRating / targetProduct.reviewCount).toFixed(2));
      localStorage.setItem('basic_products', JSON.stringify(products));
    }
    return newReview;
  },

  // Orders
  async submitOrder(orderData: any): Promise<any> {
    const orders = JSON.parse(localStorage.getItem('basic_orders') || '[]');
    const newOrder = {
      ...orderData,
      id: `order-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'processing',
      tracking_number: `BS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier_name: 'DHL Express',
      estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem('basic_orders', JSON.stringify(orders));

    // Reduce inventory of mock variants
    const products = await this.getProducts();
    localStorage.setItem('basic_products', JSON.stringify(products));

    return newOrder;
  },

  async getOrders(): Promise<any[]> {
    return JSON.parse(localStorage.getItem('basic_orders') || '[]');
  },

  // Admin CRUD for CMS/Products
  async saveProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      product.id = `prod-${Math.random().toString(36).substr(2, 9)}`;
      products.push(product);
    }
    localStorage.setItem('basic_products', JSON.stringify(products));
    return product;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem('basic_products', JSON.stringify(filtered));
    return true;
  },

  // Helpers
  mapDBProduct(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      slug: dbProduct.slug,
      description: dbProduct.description,
      basePrice: Number(dbProduct.base_price),
      category: dbProduct.category || 'T-Shirts',
      collection: dbProduct.collection || 'Essentials',
      rating: Number(dbProduct.rating || 0.0),
      reviewCount: Number(dbProduct.review_count || 0),
      sizes: dbProduct.sizes || ['S', 'M', 'L'],
      colors: dbProduct.colors || [{ name: 'Black', hex: '#000000' }],
      images: dbProduct.images || [],
      fitRecommendation: dbProduct.fit_recommendation || '',
      fabricDetails: dbProduct.fabric_details || ''
    };
  }
};
