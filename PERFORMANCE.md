# Performance Monitoring & Optimization

This document describes the performance monitoring and optimization features implemented in the Daremon website.

## Features Implemented

### 1. Web Vitals Monitoring

Automatic tracking of Core Web Vitals metrics:

- **CLS** (Cumulative Layout Shift) - Visual stability
- **FID** (First Input Delay) - Interactivity
- **FCP** (First Contentful Paint) - Loading performance
- **LCP** (Largest Contentful Paint) - Loading performance
- **TTFB** (Time to First Byte) - Server response time
- **INP** (Interaction to Next Paint) - Responsiveness

#### Viewing Metrics

**Development Mode:**
- Open browser DevTools console
- Metrics are logged with color-coded ratings:
  - 🟢 **Good** (green)
  - 🟡 **Needs Improvement** (yellow)
  - 🔴 **Poor** (red)
- Performance summary is logged 2 seconds after page load
- Metrics are stored in localStorage (last 50 metrics)

**Accessing Stored Metrics:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('webVitals'))
```

### 2. Error Boundaries

Graceful error handling with user-friendly fallback UI:

- Catches JavaScript errors in React components
- Displays informative error message in Dutch
- Provides reload and homepage navigation options
- Shows error details in development mode
- Prevents entire app crash on component errors

#### Error Boundary Location
- Wraps entire application in `app/layout.tsx`
- Can be added to specific components as needed

### 3. Performance Utilities

Custom performance measurement tools (`lib/performance.ts`):

```typescript
import { performanceMarker } from '@/lib/performance'

// Start timing
performanceMarker.start('data-fetch')

// Your code here...

// End timing (automatically logs duration)
performanceMarker.end('data-fetch')
```

### 4. Next.js Optimizations

**Enabled in `next.config.js`:**
- ✅ SWC minification (faster builds)
- ✅ Compression enabled
- ✅ Console removal in production (keeps errors/warnings)
- ✅ PoweredBy header removed (security)
- ✅ CSS optimization
- ✅ Production source maps disabled (smaller builds)

## Performance Targets

Based on Google's Core Web Vitals thresholds:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| FCP | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| TTFB | ≤ 800ms | 800ms - 1800ms | > 1800ms |
| INP | ≤ 200ms | 200ms - 500ms | > 500ms |

## Monitoring in Production

Currently metrics are logged to console in development. To implement production monitoring:

### Option 1: Google Analytics 4
```typescript
// In lib/performance.ts, add to logPerformanceMetric():
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', metric.name, {
    value: metric.value,
    metric_rating: metric.rating,
  })
}
```

### Option 2: Custom Analytics Endpoint
```typescript
// In lib/performance.ts, add to logPerformanceMetric():
if (process.env.NODE_ENV === 'production') {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  }).catch(() => {}) // Silent fail
}
```

### Option 3: Third-party Services
- Vercel Analytics (built-in for Vercel deployments)
- Sentry Performance Monitoring
- New Relic Browser Monitoring
- DataDog RUM

## Testing Performance

### 1. Lighthouse
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

### 2. WebPageTest
Visit [webpagetest.org](https://www.webpagetest.org/) and test your deployed site.

### 3. Chrome DevTools
- Open DevTools → Performance tab
- Record page load
- Analyze metrics and bottlenecks

## Best Practices

### Code Splitting
```typescript
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
})
```

### Image Optimization
```typescript
// Always specify width/height
<img
  src="/image.jpg"
  width={800}
  height={600}
  loading="lazy"
  alt="Description"
/>
```

### Font Loading
Already optimized using Next.js font optimization with system fonts.

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
# Check output in terminal
```

## Troubleshooting

### High CLS (Layout Shift)
- Specify image dimensions
- Reserve space for dynamic content
- Avoid inserting content above existing content

### High LCP
- Optimize largest image/element
- Reduce server response time
- Implement lazy loading for below-fold content

### High FID/INP
- Reduce JavaScript execution time
- Code split large bundles
- Defer non-critical JavaScript

## Maintenance

### Regular Checks
1. Monitor Web Vitals monthly
2. Run Lighthouse audits before major releases
3. Check bundle size after adding dependencies
4. Review error logs weekly

### Updating Thresholds
Edit thresholds in `lib/performance.ts`:
```typescript
const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  // ... update as needed
}
```

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
