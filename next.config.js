/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Synology Web Station (en de meeste andere statische hosts) serveren een
  // map-verzoek als "/home/" prima via hun standaard directory-index-gedrag
  // (index.html), maar kennen géén automatische extensieloze rewrite van
  // "/home" -> "/home.html". Zonder trailingSlash genereert `next export`
  // precies dat: home.html, contact.html, enz. — waardoor een verse
  // paginalading of F5 op /home een 404 van de webserver zelf oplevert (nooit
  // onze eigen 404.html). trailingSlash: true laat Next in plaats daarvan
  // home/index.html enz. genereren, wat op zulke hosts wél altijd werkt.
  trailingSlash: true,
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
