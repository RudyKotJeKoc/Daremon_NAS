/**
 * Performance utilities for daremon.nl
 */

/**
 * Debounce function - delays execution until after wait time has passed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Minimum time between calls in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, wait = 150) {
  let inThrottle;
  let lastTime = 0;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      lastTime = Date.now();
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}

/**
 * RequestAnimationFrame-based throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} - Throttled function
 */
export function rafThrottle(func) {
  let rafId = null;

  return function executedFunction(...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
}

/**
 * Lazy load function - executes callback when element enters viewport
 * @param {Element} element - Element to observe
 * @param {Function} callback - Function to call when element is visible
 * @param {Object} options - IntersectionObserver options
 */
export function lazyLoad(element, callback, options = {}) {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element);
      }
    });
  }, options);

  observer.observe(element);

  return () => observer.disconnect();
}

/**
 * Memory usage monitoring (if available)
 * @returns {Object|null} - Memory usage info or null
 */
export function getMemoryUsage() {
  if (performance.memory) {
    return {
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
    };
  }
  return null;
}

/**
 * Log memory usage to console
 */
export function logMemoryUsage() {
  const memory = getMemoryUsage();
  if (memory) {
    console.log(
      `Memory: ${memory.usedJSHeapSize} MB / ${memory.totalJSHeapSize} MB (limit: ${memory.jsHeapSizeLimit} MB)`
    );
  }
}

/**
 * Performance observer for long tasks
 * @param {Function} callback - Called when long task detected
 * @param {number} threshold - Threshold in ms (default 50ms)
 */
export function observeLongTasks(callback, threshold = 50) {
  if (!('PerformanceObserver' in window)) {
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > threshold) {
          callback(entry);
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
    return observer;
  } catch (e) {
    console.warn('PerformanceObserver not supported for longtask:', e);
    return null;
  }
}
