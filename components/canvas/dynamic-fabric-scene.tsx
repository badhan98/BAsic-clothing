'use client';

import dynamic from 'next/dynamic';

export const DynamicFabricScene = dynamic(
  () => import('./fabric-scene'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
        <div className="text-white/20 font-light tracking-widest text-sm animate-pulse">
          INITIALIZING CANVAS...
        </div>
      </div>
    )
  }
);
