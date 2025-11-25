/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Legacy routing:
  // In 'export' mode, rewrites() don't work, but files in public/ are automatically served.
  // Legacy factory site copied to public/legacy/ (gitignored, source in legacy-factory-site/)
  // Access: /legacy/index.html, /legacy/audio/*, /legacy/scripts/*, etc.
  // This ensures ZERO collision between Next.js bundle and legacy static files.
}

module.exports = nextConfig
