import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LenisProvider from '@/components/lenis-provider';
import CustomCursor from '@/components/custom-cursor';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BASIC — Minimal Clothing. Maximum Confidence.',
  description: 'Premium everyday essentials engineered for modern aesthetics. Built with sustainable craftsmanship and luxury materials.',
  keywords: 'luxury fashion, basic clothing, minimalist apparel, premium everyday wear, nextjs e-commerce',
  openGraph: {
    title: 'BASIC — Minimal Clothing. Maximum Confidence.',
    description: 'Premium everyday essentials engineered for modern aesthetics.',
    type: 'website',
    url: 'https://basic-clothing.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'BASIC Lookbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BASIC — Minimal Clothing. Maximum Confidence.',
    description: 'Premium everyday essentials engineered for modern aesthetics.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-[#050505] text-white">
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
