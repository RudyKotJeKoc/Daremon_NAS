'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '%c[Error Boundary]',
        'color: #ef4444; font-weight: bold; font-size: 14px',
        error,
        errorInfo
      )
    }

    // In production, this could send error to error tracking service
    // Example: logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full backdrop-blur-sm bg-slate-900/50 border border-red-500/30 rounded-lg p-6 sm:p-8 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <div className="flex items-start gap-3 mb-4">
              <svg
                className="w-6 h-6 text-red-400 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">
                  Er is iets misgegaan
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Een onverwachte fout heeft zich voorgedaan. Probeer de pagina opnieuw te laden.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mb-4">
                    <summary className="text-xs text-red-400 cursor-pointer hover:text-red-300 transition">
                      Foutdetails (alleen zichtbaar in ontwikkelmodus)
                    </summary>
                    <pre className="mt-2 text-xs text-red-300 bg-slate-950/50 p-3 rounded border border-red-500/20 overflow-x-auto">
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Pagina opnieuw laden
                </button>

                <a
                  href="/"
                  className="block w-full mt-3 px-4 py-2 text-center border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Terug naar homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
