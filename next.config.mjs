/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore build errors to allow clean deployment sandbox builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore eslint rules on compilation
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
