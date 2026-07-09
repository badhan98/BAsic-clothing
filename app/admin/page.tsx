'use client';

import { useState, useEffect } from 'react';
import { db, Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { LayoutDashboard, ShoppingCart, Box, Users, FileText, Tag, Settings, LogOut, CheckCircle, Clock, Trash2, Edit3, Plus } from 'lucide-react';
import Link from 'next/link';

// Mock Analytics Data
const REVENUE_DATA = [
  { name: 'Jan', revenue: 12400, sales: 110 },
  { name: 'Feb', revenue: 15100, sales: 130 },
  { name: 'Mar', revenue: 19800, sales: 160 },
  { name: 'Apr', revenue: 17200, sales: 145 },
  { name: 'May', revenue: 24500, sales: 210 },
  { name: 'Jun', revenue: 31000, sales: 280 },
  { name: 'Jul', revenue: 29500, sales: 260 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const logoutStore = useStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'newsletter'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('T-Shirts');
  const [newProdCollection, setNewProdCollection] = useState('Essentials');
  const [newProdPrice, setNewProdPrice] = useState(65.00);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Protect Admin Route: log in automatically as guest admin if no active user session
  useEffect(() => {
    const checkAuth = () => {
      if (!user) {
        // Log in automatically for sandbox experience
        useStore.getState().login('admin@basic-clothing.com', 'Admin', 'Officer');
      }
      setLoading(false);
    };
    checkAuth();
  }, [user]);

  // Load Data
  useEffect(() => {
    const loadAdminData = async () => {
      const prods = await db.getProducts();
      setProducts(prods);

      const ordList = await db.getOrders();
      setOrders(ordList);

      const emails = JSON.parse(localStorage.getItem('basic_newsletter') || '[]');
      setNewsletterEmails(emails);
    };
    loadAdminData();
  }, [activeTab]);

  const handleLogout = () => {
    logoutStore();
    router.push('/auth');
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const slug = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      name: newProdName,
      slug,
      description: newProdDesc || 'Premium clothing accessory engineered for modern aesthetic lines.',
      basePrice: Number(newProdPrice),
      category: newProdCategory,
      collection: newProdCollection,
      rating: 5.0,
      reviewCount: 0,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Charcoal', hex: '#2A2A2A' },
        { name: 'Pitch Black', hex: '#0D0D0D' }
      ],
      images: [
        { color: 'Charcoal', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', isPrimary: true }
      ],
      fitRecommendation: 'Fits true to size. Regular structure.',
      fabricDetails: '100% Cotton knit fabric lines.'
    };

    await db.saveProduct(newProduct);
    setProducts([newProduct, ...products]);
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice(65.00);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    await db.deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/20 font-light tracking-widest text-sm animate-pulse">LOADING DASHBOARD GATE...</div>
      </div>
    );
  }

  // Summary Metrics calculations
  const totalRevenue = REVENUE_DATA.reduce((sum, item) => sum + item.revenue, 0) + orders.reduce((sum, item) => sum + item.total, 0);
  const totalSalesCount = REVENUE_DATA.reduce((sum, item) => sum + item.sales, 0) + orders.length;

  return (
    <div className="pt-24 min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      
      {/* 1. SIDEBAR NAV */}
      <aside className="w-full md:w-64 bg-[#0b0b0b] border-r border-white/5 p-6 space-y-8 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-white/40 block">Identity Session</span>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              {user?.firstName} {user?.lastName}
            </h3>
            <span className="text-[9px] text-white/30 font-mono tracking-wider block">{user?.email}</span>
          </div>

          <nav className="flex flex-col space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-all cursor-none ${
                activeTab === 'overview' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="uppercase tracking-widest text-[10px]">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-all cursor-none ${
                activeTab === 'products' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span className="uppercase tracking-widest text-[10px]">Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-all cursor-none ${
                activeTab === 'orders' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="uppercase tracking-widest text-[10px]">Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('newsletter')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-all cursor-none ${
                activeTab === 'newsletter' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="uppercase tracking-widest text-[10px]">Newsletter ({newsletterEmails.length})</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-white/50 hover:text-white transition-colors cursor-none text-xs uppercase tracking-widest text-[10px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>
      </aside>

      {/* 2. MAIN CONTAINER PANEL */}
      <main className="flex-1 p-8 md:p-12 overflow-x-hidden space-y-10">
        
        {/* OVERVIEW PANEL TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            {/* Header Titles */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-xl uppercase font-bold tracking-widest">Core Performance Overview</h2>
              <div className="flex items-center space-x-3 text-[10px] text-white/40 uppercase tracking-widest">
                <button className="hover:text-white transition-colors cursor-none">Export Excel</button>
                <span>•</span>
                <button className="hover:text-white transition-colors cursor-none">Export PDF</button>
              </div>
            </div>

            {/* Metrics Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Tile 1 */}
              <div className="bg-[#0b0b0b] border border-white/5 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 block">Combined Revenue</span>
                <h3 className="text-2xl font-semibold">${totalRevenue.toLocaleString()}</h3>
                <span className="text-[9px] text-green-500 font-medium block">▲ 18.2% vs last month</span>
              </div>
              {/* Tile 2 */}
              <div className="bg-[#0b0b0b] border border-white/5 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 block">Unit Volume Sales</span>
                <h3 className="text-2xl font-semibold">{totalSalesCount} units</h3>
                <span className="text-[9px] text-green-500 font-medium block">▲ 14.5% vs last month</span>
              </div>
              {/* Tile 3 */}
              <div className="bg-[#0b0b0b] border border-white/5 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 block">Active Listings</span>
                <h3 className="text-2xl font-semibold">{products.length} products</h3>
                <span className="text-[9px] text-white/40 block">Across 6 luxury categories</span>
              </div>
              {/* Tile 4 */}
              <div className="bg-[#0b0b0b] border border-white/5 p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 block">Lead Subscribers</span>
                <h3 className="text-2xl font-semibold">{newsletterEmails.length} leads</h3>
                <span className="text-[9px] text-white/40 block">Synced with CMS lookbooks</span>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0b0b0b] border border-white/5 p-6 space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Revenue Curve (USD)</h4>
                <div className="h-64 w-full text-[10px] font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#555" />
                      <YAxis stroke="#555" />
                      <Tooltip contentStyle={{ backgroundColor: '#0b0b0b', borderColor: '#222', color: '#fff' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0b0b0b] border border-white/5 p-6 space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white/90">Order Count (Units)</h4>
                <div className="h-64 w-full text-[10px] font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#555" />
                      <YAxis stroke="#555" />
                      <Tooltip contentStyle={{ backgroundColor: '#0b0b0b', borderColor: '#222', color: '#fff' }} />
                      <Bar dataKey="sales" fill="#ffffff" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS PANEL TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 className="text-xl uppercase font-bold tracking-widest">Inventory Management</h2>
              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="bg-white text-black px-4 py-2 text-[10px] uppercase tracking-widest font-semibold hover:bg-white/80 transition-colors flex items-center space-x-1.5 cursor-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Add Product Form */}
            {isAddingProduct && (
              <form onSubmit={handleAddProduct} className="bg-[#0b0b0b] border border-white/5 p-6 space-y-4 max-w-xl text-xs font-light">
                <h4 className="text-xs uppercase tracking-widest font-semibold">New Product Coordinates</h4>
                
                <div className="space-y-1.5">
                  <label className="text-white/50 block">Product Name</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="E.G. SCULPTED LINEN SHIRT"
                    className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white uppercase focus:outline-none focus:border-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white"
                    >
                      <option value="Hoodies">Hoodies</option>
                      <option value="Polo Shirts">Polo Shirts</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Sweatshirts">Sweatshirts</option>
                      <option value="Jackets">Jackets</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Collection</label>
                    <select
                      value={newProdCollection}
                      onChange={(e) => setNewProdCollection(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white"
                    >
                      <option value="Essentials">Essentials</option>
                      <option value="Oversized">Oversized</option>
                      <option value="New Arrivals">New Arrivals</option>
                      <option value="Limited Edition">Limited Edition</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/50 block">Base Price (USD)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/50 block">Description</label>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="PRODUCT SPECIFICATIONS AND TEXTURES"
                    className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white h-20 focus:outline-none focus:border-white uppercase resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="border border-white/20 px-4 py-2 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-2 font-semibold hover:bg-white/80"
                  >
                    Save Listing
                  </button>
                </div>
              </form>
            )}

            {/* Listings Grid */}
            <div className="bg-[#0b0b0b] border border-white/5 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 uppercase tracking-widest text-[10px]">
                    <th className="p-4 font-semibold text-white/60">Product Details</th>
                    <th className="p-4 font-semibold text-white/60">Category</th>
                    <th className="p-4 font-semibold text-white/60">Collection</th>
                    <th className="p-4 font-semibold text-white/60">Price</th>
                    <th className="p-4 font-semibold text-white/60">Rating</th>
                    <th className="p-4 font-semibold text-white/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-light">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5">
                      <td className="p-4 flex items-center space-x-3">
                        <div className="w-8 h-10 bg-[#101010] relative flex-shrink-0 border border-white/5">
                          <img src={p.images[0]?.url} alt="" className="w-full h-full object-cover filter grayscale" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{p.name}</span>
                          <span className="text-[9px] text-white/40 block font-mono uppercase">{p.slug}</span>
                        </div>
                      </td>
                      <td className="p-4 text-white/80">{p.category}</td>
                      <td className="p-4 text-white/80">{p.collection}</td>
                      <td className="p-4 text-white/90 font-mono">${p.basePrice.toFixed(2)}</td>
                      <td className="p-4 text-white/80 font-mono">★ {p.rating} ({p.reviewCount})</td>
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-white/40 hover:text-red-500 transition-colors cursor-none"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS PANEL TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl uppercase font-bold tracking-widest">Order Processing Log</h2>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 bg-[#0b0b0b] border border-white/5 text-center">
                <p className="text-white/40 font-light tracking-wide text-xs">No customer orders have executed on the sandbox db yet.</p>
              </div>
            ) : (
              <div className="bg-[#0b0b0b] border border-white/5 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 uppercase tracking-widest text-[10px]">
                      <th className="p-4 font-semibold text-white/60">Order Reference</th>
                      <th className="p-4 font-semibold text-white/60">Contact Email</th>
                      <th className="p-4 font-semibold text-white/60">Subtotal</th>
                      <th className="p-4 font-semibold text-white/60">Tax & Shipping</th>
                      <th className="p-4 font-semibold text-white/60">Total Cost</th>
                      <th className="p-4 font-semibold text-white/60">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5">
                        <td className="p-4 space-y-1">
                          <span className="font-semibold text-white block uppercase">{ord.id}</span>
                          <span className="text-[9px] text-white/40 font-mono block">DATE: {new Date(ord.created_at).toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-white/80">{ord.email}</td>
                        <td className="p-4 text-white/85 font-mono">${ord.subtotal.toFixed(2)}</td>
                        <td className="p-4 text-white/85 font-mono">Tax: ${ord.tax.toFixed(2)} | Ship: ${ord.shipping_cost.toFixed(2)}</td>
                        <td className="p-4 text-white/95 font-semibold font-mono">${ord.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-green-500/10 border border-green-500/20 text-green-500 rounded-sm">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* NEWSLETTER PANEL TAB */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl uppercase font-bold tracking-widest">Newsletter Subscribers</h2>
            </div>

            {newsletterEmails.length === 0 ? (
              <div className="py-12 bg-[#0b0b0b] border border-white/5 text-center">
                <p className="text-white/40 font-light tracking-wide text-xs">No email subscribers registered yet.</p>
              </div>
            ) : (
              <div className="bg-[#0b0b0b] border border-white/5 max-w-md">
                <div className="p-4 border-b border-white/10 bg-white/5 uppercase tracking-widest text-[10px] font-semibold text-white/60">
                  Email Coordinates
                </div>
                <div className="divide-y divide-white/5 font-mono text-[11px] font-light">
                  {newsletterEmails.map((email, idx) => (
                    <div key={idx} className="p-4 text-white/80 hover:bg-white/5 flex items-center justify-between">
                      <span>{email}</span>
                      <span className="text-[9px] text-white/30 uppercase">Active Subscriber</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
