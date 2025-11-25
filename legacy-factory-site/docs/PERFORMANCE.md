# Performance Optimization Guide

## Overview

This guide provides comprehensive performance optimization strategies for the Radio ETS application, focusing on loading speed, runtime performance, and user experience.

## Image Optimization

### Current Implementation

✅ **Implemented:**
- SVG format for icons (scalable, small file size)
- Lazy loading on all images (`loading="lazy"`)
- Width/height attributes to prevent layout shift
- Local fallback images instead of external placeholders

### Recommendations

#### 1. Use Modern Image Formats

**WebP Support:**
```html
<picture>
  <source srcset="album-cover.webp" type="image/webp">
  <source srcset="album-cover.jpg" type="image/jpeg">
  <img src="album-cover.jpg" alt="Album Cover" loading="lazy" width="120" height="120">
</picture>
```

**AVIF for even better compression:**
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." loading="lazy">
</picture>
```

#### 2. Image Optimization Tools

**Recommended tools:**
```bash
# Install Sharp for image optimization
npm install sharp

# Optimize images
node scripts/optimize-images.js
```

**Example optimization script:**
```javascript
import sharp from 'sharp';
import { readdir } from 'fs/promises';

const files = await readdir('./images');

for (const file of files) {
  if (file.match(/\.(jpg|png)$/)) {
    // Generate WebP
    await sharp(`./images/${file}`)
      .webp({ quality: 85 })
      .toFile(`./images/${file.replace(/\.(jpg|png)$/, '.webp')}`);

    // Generate AVIF
    await sharp(`./images/${file}`)
      .avif({ quality: 65 })
      .toFile(`./images/${file.replace(/\.(jpg|png)$/, '.avif')}`);
  }
}
```

#### 3. Responsive Images

```html
<img
  srcset="
    cover-small.webp 120w,
    cover-medium.webp 240w,
    cover-large.webp 480w
  "
  sizes="(max-width: 768px) 120px, 240px"
  src="cover-medium.webp"
  alt="Album Cover"
  loading="lazy"
  width="240"
  height="240"
>
```

### Image Size Guidelines

| Type | Max Dimensions | Target Size | Format |
|------|---------------|-------------|---------|
| Album Covers | 800x800 | < 100 KB | WebP/AVIF |
| Thumbnails | 120x120 | < 20 KB | WebP |
| OG Images | 1200x630 | < 300 KB | WebP/JPG |
| Icons | Vector | < 5 KB | SVG |
| Photos | 1920x1080 | < 200 KB | WebP/AVIF |

## JavaScript Optimization

### Current Implementation

✅ **Good practices:**
- ES6 modules for code splitting
- Event delegation where appropriate
- Debouncing for scroll/resize events
- Efficient DOM queries (cached references)

### Code Splitting

**Dynamic imports for features:**
```javascript
// Load visualizer only when needed
document.getElementById('toggle-visualizer').addEventListener('click', async () => {
  const { Visualizer3D } = await import('./visualizer/Visualizer3D.js');
  const visualizer = new Visualizer3D();
  visualizer.init();
});
```

### Bundle Optimization

**Vite configuration:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['gsap'],
          'three': ['three'],
          'visualizer': ['./visualizer/Visualizer3D.js', './visualizer/AudioVisualizerSwitch.js']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  }
};
```

### Tree Shaking

**Import only what you need:**
```javascript
// ❌ BAD - imports entire library
import * as THREE from 'three';

// ✅ GOOD - imports only needed modules
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
```

## CSS Optimization

### Current Implementation

✅ **Optimized:**
- CSS Variables for theming
- Mobile-first responsive design
- Hardware-accelerated animations (transform, opacity)

### Critical CSS

**Extract above-the-fold CSS:**
```html
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Critical styles for initial render */
    body { font-family: 'Inter', sans-serif; margin: 0; }
    .app-header { /* ... */ }
  </style>

  <!-- Defer non-critical CSS -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

### CSS Minification

```bash
# Build process already handles this with Vite
npm run build
```

### Reduce Unused CSS

**Use PurgeCSS in build:**
```javascript
// vite.config.js
import { purgeCss } from 'vite-plugin-purgecss';

export default {
  plugins: [
    purgeCss({
      content: ['./index.html', './src/**/*.js']
    })
  ]
};
```

### Animation Performance

**Use will-change sparingly:**
```css
/* Only on elements that will animate */
.track-cover.animating {
  will-change: transform;
}

/* Remove after animation */
.track-cover {
  will-change: auto;
}
```

**Prefer transform over position changes:**
```css
/* ✅ GOOD - GPU accelerated */
.slide-in {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

/* ❌ BAD - triggers layout */
.slide-in {
  left: 0;
  transition: left 0.3s ease;
}
```

## Font Optimization

### Current Implementation

✅ **Good:**
- Preconnect to Google Fonts
- `display=swap` for font loading

### Font Loading Strategy

**Optimize further:**
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/Orbitron-Bold.woff2" as="font" type="font/woff2" crossorigin>

<!-- Self-host fonts for better performance -->
<style>
  @font-face {
    font-family: 'Orbitron';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('/fonts/Orbitron-Bold.woff2') format('woff2');
  }
</style>
```

### Font Subsetting

**Include only needed characters:**
```bash
# Use glyphhanger to create font subsets
npx glyphhanger --subset=fonts/Orbitron.ttf --formats=woff2
```

## Caching Strategy

### Service Worker Caching

**Current implementation (sw.js):**
```javascript
// Cache versioning
const CACHE_VERSION = 'v11';

// Cache-first for app shell
// Stale-while-revalidate for dynamic content
```

### HTTP Caching Headers

**Create .htaccess:**
```apache
# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On

  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"

  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"

  # Audio
  ExpiresByType audio/mpeg "access plus 1 year"

  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"

  # HTML
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Enable Gzip
<IfModule mod_gzip.c>
  mod_gzip_on Yes
  mod_gzip_item_include file \.(html?|txt|css|js|php|pl|json|svg)$
</IfModule>
```

### Cache Busting

**Vite handles this automatically:**
```html
<!-- Generated in build -->
<script src="/assets/app.abc123.js"></script>
<link rel="stylesheet" href="/assets/style.def456.css">
```

## Audio Optimization

### Current Implementation

✅ **Optimized:**
- Audio preloading controlled by config
- Lazy loading strategy for 500+ tracks
- Crossfade between tracks

### Audio Format Recommendations

| Format | Use Case | Bitrate | Size (3min) |
|--------|----------|---------|-------------|
| MP3 | Compatibility | 128 kbps | ~3 MB |
| MP3 | Good Quality | 192 kbps | ~4.5 MB |
| AAC | Modern Browsers | 128 kbps | ~2.5 MB |
| Opus | Best Quality/Size | 96 kbps | ~2 MB |

**Multi-format audio:**
```html
<audio>
  <source src="track.opus" type="audio/opus">
  <source src="track.m4a" type="audio/mp4">
  <source src="track.mp3" type="audio/mpeg">
</audio>
```

### Audio Streaming

**For large playlists, consider streaming:**
```javascript
// Use Media Source Extensions for streaming
const mediaSource = new MediaSource();
audio.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', () => {
  const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
  // Fetch and append audio chunks
});
```

## Loading Performance

### Metrics to Track

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Measure with:**
```javascript
// Web Vitals library
import { getLCP, getFID, getCLS } from 'web-vitals';

getLCP(console.log);
getFID(console.log);
getCLS(console.log);
```

### Resource Hints

**Current:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Additional hints:**
```html
<!-- Preload critical resources -->
<link rel="preload" href="/app.js" as="script">
<link rel="preload" href="/styles.css" as="style">

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

<!-- Prefetch next page -->
<link rel="prefetch" href="/polls.html">
```

## Runtime Performance

### DOM Manipulation

**Batch DOM updates:**
```javascript
// ❌ BAD - causes multiple reflows
for (let i = 0; i < items.length; i++) {
  list.appendChild(createItem(items[i]));
}

// ✅ GOOD - single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < items.length; i++) {
  fragment.appendChild(createItem(items[i]));
}
list.appendChild(fragment);
```

### Memory Management

**Clean up event listeners:**
```javascript
// Use AbortController for easy cleanup
const controller = new AbortController();

element.addEventListener('click', handler, {
  signal: controller.signal
});

// Later: remove all listeners
controller.abort();
```

**Monitor memory:**
```javascript
// Use Performance Observer
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Memory usage:', entry.memory);
  }
});
observer.observe({ entryTypes: ['measure'] });
```

## Build Optimization

### Production Build

**Current Vite build process:**
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Compression

**Enable Brotli compression:**
```bash
# Install plugin
npm install vite-plugin-compression --save-dev

# vite.config.js
import compression from 'vite-plugin-compression';

export default {
  plugins: [
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
};
```

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install rollup-plugin-visualizer --save-dev

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
};
```

## Performance Budget

### Target Sizes

| Resource | Budget | Current |
|----------|--------|---------|
| HTML | < 20 KB | ~15 KB |
| CSS | < 50 KB | ~45 KB |
| JavaScript (total) | < 200 KB | ~180 KB |
| Images (per page) | < 500 KB | TBD |
| Fonts | < 100 KB | ~80 KB |
| **Total (first load)** | **< 1 MB** | **~320 KB** |

### Monitoring

**Lighthouse CI:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://daremon.nl
          budgetPath: ./budget.json
```

**budget.json:**
```json
{
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 200
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "image",
      "budget": 500
    }
  ]
}
```

## Performance Checklist

- [ ] Images optimized (WebP/AVIF)
- [ ] Lazy loading on images
- [ ] Width/height attributes on all images
- [ ] Critical CSS inlined
- [ ] JavaScript code-split by route
- [ ] Bundle size analyzed and optimized
- [ ] Service Worker caching implemented
- [ ] HTTP caching headers configured
- [ ] Fonts optimized (subset, woff2, preload)
- [ ] Compression enabled (Gzip/Brotli)
- [ ] Core Web Vitals measured
- [ ] Performance budget defined
- [ ] Lighthouse score > 90

## Tools & Resources

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [web.dev](https://web.dev/measure/)
- [bundlephobia](https://bundlephobia.com/)
- [Squoosh](https://squoosh.app/) - Image optimization
- [Font Subsetting](https://everythingfonts.com/subsetter)

---

**Last Updated:** 2025-11-09
**Review Frequency:** Monthly
