'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'
import { reportWebVital } from '@/lib/performance'

/**
 * Web Vitals Reporter Component
 * Automatically reports Core Web Vitals metrics using Next.js built-in hook
 *
 * Core Web Vitals tracked:
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVital(metric)
  })

  // Log performance summary on mount (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Wait for page to fully load
      const timer = setTimeout(() => {
        const { getPerformanceSummary } = require('@/lib/performance')
        const summary = getPerformanceSummary()
        if (summary) {
          console.log(
            '%c[Performance Summary]',
            'color: #3b82f6; font-weight: bold; font-size: 14px',
            summary
          )
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  return null
}
