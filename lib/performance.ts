/**
 * Performance monitoring utilities for tracking Core Web Vitals
 * and custom performance metrics
 */

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  id?: string
  navigationType?: string
}

/**
 * Core Web Vitals thresholds (from web.dev)
 * - Good: green
 * - Needs Improvement: yellow
 * - Poor: red
 */
const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },      // Cumulative Layout Shift
  FID: { good: 100, poor: 300 },       // First Input Delay (ms)
  FCP: { good: 1800, poor: 3000 },     // First Contentful Paint (ms)
  LCP: { good: 2500, poor: 4000 },     // Largest Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 },     // Time to First Byte (ms)
  INP: { good: 200, poor: 500 },       // Interaction to Next Paint (ms)
}

/**
 * Get rating based on metric value and thresholds
 */
function getRating(
  metricName: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS]

  if (!thresholds) return 'good'

  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Log performance metric (can be extended to send to analytics)
 */
export function logPerformanceMetric(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c[Performance] ${metric.name}`,
      `color: ${metric.rating === 'good' ? '#10b981' : metric.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'}; font-weight: bold`,
      {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        id: metric.id,
      }
    )
  }

  // In production, this could send data to your analytics service
  // Example: sendToAnalytics(metric)
}

/**
 * Report Web Vital metric
 */
export function reportWebVital(metric: any) {
  const performanceMetric: PerformanceMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  }

  logPerformanceMetric(performanceMetric)

  // Store in localStorage for debugging (development only)
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      const metrics = JSON.parse(localStorage.getItem('webVitals') || '[]')
      metrics.push({
        ...performanceMetric,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      })
      // Keep only last 50 metrics
      if (metrics.length > 50) metrics.splice(0, metrics.length - 50)
      localStorage.setItem('webVitals', JSON.stringify(metrics))
    } catch (error) {
      // Ignore localStorage errors
    }
  }
}

/**
 * Custom performance markers
 */
export const performanceMarker = {
  start(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`)
    }
  },

  end(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)

        const measure = performance.getEntriesByName(name, 'measure')[0]
        if (measure) {
          logPerformanceMetric({
            name: `Custom: ${name}`,
            value: measure.duration,
            rating: measure.duration < 100 ? 'good' : measure.duration < 300 ? 'needs-improvement' : 'poor',
          })
        }
      } catch (error) {
        // Ignore errors
      }
    }
  },
}

/**
 * Get performance summary
 */
export function getPerformanceSummary() {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  return {
    // Navigation timing
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,

    // Paint timing
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

    // Connection info
    transferSize: navigation?.transferSize || 0,

    // Memory (if available)
    memory: (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
    } : null,
  }
}
