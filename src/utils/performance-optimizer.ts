import { useMemo, useCallback, useRef, useEffect } from 'react';

// Memoization utility with TTL (Time To Live)
class MemoCache<T> {
  private cache = new Map<string, { value: T; timestamp: number; ttl: number }>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instances
const calculationCache = new MemoCache(10 * 60 * 1000); // 10 minutes for calculations
const templateCache = new MemoCache(30 * 60 * 1000); // 30 minutes for templates
const nutritionCache = new MemoCache(5 * 60 * 1000); // 5 minutes for nutrition data

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoized calculation hook
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: any[],
  cacheKey?: string,
  ttl?: number
): T {
  return useMemo(() => {
    if (cacheKey) {
      const cached = calculationCache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    const result = calculation();
    
    if (cacheKey) {
      calculationCache.set(cacheKey, result, ttl);
    }
    
    return result;
  }, dependencies);
}

// Optimized template loading hook
export function useOptimizedTemplateLoading<T>(
  loadFunction: () => Promise<T[]>,
  cacheKey: string,
  dependencies: any[] = []
) {
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    // Check cache first
    const cached = templateCache.get(cacheKey);
    if (cached) {
      setData(cached);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await loadFunction();
      
      if (!abortControllerRef.current.signal.aborted) {
        setData(result);
        templateCache.set(cacheKey, result);
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        setError(err as Error);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [loadFunction, cacheKey]);

  useEffect(() => {
    loadData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return { data, loading, error, reload: loadData };
}

// Batch processing utility
export class BatchProcessor<T, R> {
  private queue: T[] = [];
  private processing = false;
  private batchSize: number;
  private delay: number;
  private processor: (batch: T[]) => Promise<R[]>;

  constructor(
    processor: (batch: T[]) => Promise<R[]>,
    batchSize: number = 10,
    delay: number = 100
  ) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.delay = delay;
  }

  add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({ ...item, resolve, reject } as any);
      this.scheduleProcessing();
    });
  }

  private scheduleProcessing() {
    if (this.processing) return;

    setTimeout(() => {
      this.processBatch();
    }, this.delay);
  }

  private async processBatch() {
    if (this.queue.length === 0 || this.processing) return;

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      const results = await this.processor(batch.map(item => {
        const { resolve, reject, ...data } = item as any;
        return data;
      }));

      batch.forEach((item: any, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach((item: any) => {
        item.reject(error);
      });
    } finally {
      this.processing = false;
      
      // Process remaining items
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();

  start(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  end(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    this.metrics.get(operation)!.push(duration);
    this.startTimes.delete(operation);
    
    return duration;
  }

  getStats(operation: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const durations = this.metrics.get(operation);
    if (!durations || durations.length === 0) return null;

    return {
      count: durations.length,
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      total: durations.reduce((a, b) => a + b, 0)
    };
  }

  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    for (const [operation] of this.metrics) {
      stats[operation] = this.getStats(operation);
    }
    return stats;
  }

  clear(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(operation: string) {
  const start = useCallback(() => {
    performanceMonitor.start(operation);
  }, [operation]);

  const end = useCallback(() => {
    return performanceMonitor.end(operation);
  }, [operation]);

  const getStats = useCallback(() => {
    return performanceMonitor.getStats(operation);
  }, [operation]);

  return { start, end, getStats };
}

// Cleanup utility for cache management
export function setupCacheCleanup() {
  // Clean up caches every 5 minutes
  setInterval(() => {
    calculationCache.cleanup();
    templateCache.cleanup();
    nutritionCache.cleanup();
  }, 5 * 60 * 1000);
}

// Export cache instances for direct access if needed
export { calculationCache, templateCache, nutritionCache };
