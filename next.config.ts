import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.wpsstatic.com',
        pathname: '/images/**',
      },
    ],
    unoptimized: false, // Allow Next.js to optimize images
  },
};

export default nextConfig;
