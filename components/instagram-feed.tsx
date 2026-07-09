'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';

const Instagram = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2005/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


const INSTA_POSTS = [
  {
    id: 'post-1',
    imgUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    likes: '1.2k',
    comments: '42'
  },
  {
    id: 'post-2',
    imgUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    likes: '890',
    comments: '18'
  },
  {
    id: 'post-3',
    imgUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop',
    likes: '2.4k',
    comments: '95'
  },
  {
    id: 'post-4',
    imgUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop',
    likes: '1.5k',
    comments: '36'
  },
  {
    id: 'post-5',
    imgUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop',
    likes: '3.1k',
    comments: '112'
  },
  {
    id: 'post-6',
    imgUrl: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=600&auto=format&fit=crop',
    likes: '720',
    comments: '24'
  }
];

export default function InstagramFeed() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">Digital Studio</span>
        <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-tight">STUDIO MATRIX</h2>
        <p className="text-[10px] md:text-xs text-white/50 tracking-wider font-light uppercase">
          Follow <a href="https://instagram.com" target="_blank" rel="noreferrer" className="underline cursor-none hover:text-white">@BASIC.STUDIO</a> on Instagram
        </p>
      </div>

      {/* Masonry-like Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {INSTA_POSTS.map((post) => (
          <a
            key={post.id}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="relative aspect-square bg-[#101010] overflow-hidden group border border-white/5 block cursor-none"
          >
            <img
              src={post.imgUrl}
              alt="Instagram feed upload"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-110"
            />
            {/* Hover reveals likes / comments info */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2 text-white">
              <Instagram className="w-5 h-5 text-white/80" />
              <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest uppercase">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
