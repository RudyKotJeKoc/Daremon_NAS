/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,

  // Performance optimizations
  swcMinify: true,
  compress: true,

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Production source maps (disabled for smaller builds)
  productionBrowserSourceMaps: false,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // PoweredBy header removal (security)
  poweredByHeader: false,

  // Legacy routing:
  // In 'export' mode, rewrites() don't work, but files in public/ are automatically served.
  // Legacy factory site mirrored from legacy-factory-site/ to public/legacy/ (committed to repo)
  // Access: /legacy/index.html, /legacy/audio/*, /legacy/scripts/*, etc.
  // This ensures ZERO collision between Next.js bundle and legacy static files.

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
