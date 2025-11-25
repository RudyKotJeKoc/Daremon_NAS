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
  // Legacy factory site mirrored from legacy-factory-site/ to public/legacy/ (committed to repo)
  // Access: /legacy/index.html, /legacy/audio/*, /legacy/scripts/*, etc.
  // This ensures ZERO collision between Next.js bundle and legacy static files.
}

module.exports = nextConfig
