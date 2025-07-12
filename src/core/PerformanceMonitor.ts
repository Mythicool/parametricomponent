/**
 * Performance Monitor for Parametric System
 * Tracks and optimizes real-time parameter updates and rendering performance
 */

export interface PerformanceMetrics {
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
  componentCount: number;
  parameterUpdateCount: number;
  averageRenderTime: number;
  peakMemoryUsage: number;
}

export interface PerformanceConfig {
  enableMonitoring: boolean;
  sampleRate: number;
  maxSamples: number;
  alertThresholds: {
    renderTime: number;
    memoryUsage: number;
    updateTime: number;
  };
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private samples: PerformanceMetrics[] = [];
  private config: PerformanceConfig;
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableMonitoring: true,
      sampleRate: 1000, // Sample every second
      maxSamples: 100,
      alertThresholds: {
        renderTime: 16, // 60fps threshold
        memoryUsage: 100 * 1024 * 1024, // 100MB
        updateTime: 5 // 5ms
      },
      ...config
    };

    this.metrics = {
      renderTime: 0,
      updateTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      parameterUpdateCount: 0,
      averageRenderTime: 0,
      peakMemoryUsage: 0
    };

    if (this.config.enableMonitoring) {
      this.startMonitoring();
    }
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    setInterval(() => {
      this.collectMetrics();
    }, this.config.sampleRate);
  }

  /**
   * Measure render time for a component
   */
  measureRender<T>(componentType: string, renderFn: () => T): T {
    if (!this.config.enableMonitoring) {
      return renderFn();
    }

    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    this.updateRenderMetrics(renderTime);
    
    if (renderTime > this.config.alertThresholds.renderTime) {
      this.notifyAlert('render', {
        componentType,
        renderTime,
        threshold: this.config.alertThresholds.renderTime
      });
    }

    return result;
  }

  /**
   * Measure parameter update time
   */
  measureUpdate<T>(updateFn: () => T): T {
    if (!this.config.enableMonitoring) {
      return updateFn();
    }

    const startTime = performance.now();
    const result = updateFn();
    const endTime = performance.now();
    
    const updateTime = endTime - startTime;
    this.updateUpdateMetrics(updateTime);
    
    if (updateTime > this.config.alertThresholds.updateTime) {
      this.notifyAlert('update', {
        updateTime,
        threshold: this.config.alertThresholds.updateTime
      });
    }

    return result;
  }

  /**
   * Record component count
   */
  recordComponentCount(count: number): void {
    this.metrics.componentCount = count;
  }

  /**
   * Record parameter update
   */
  recordParameterUpdate(): void {
    this.metrics.parameterUpdateCount++;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance history
   */
  getHistory(): PerformanceMetrics[] {
    return [...this.samples];
  }

  /**
   * Subscribe to performance alerts
   */
  onAlert(callback: (type: string, data: any) => void): () => void {
    const observer = callback;
    this.observers.push(observer);
    
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.averageRenderTime > this.config.alertThresholds.renderTime) {
      recommendations.push('Consider optimizing component rendering - average render time is high');
    }
    
    if (this.metrics.componentCount > 50) {
      recommendations.push('High component count detected - consider component pooling or virtualization');
    }
    
    if (this.metrics.memoryUsage > this.config.alertThresholds.memoryUsage) {
      recommendations.push('High memory usage detected - check for memory leaks');
    }
    
    if (this.metrics.parameterUpdateCount > 1000) {
      recommendations.push('High parameter update frequency - consider debouncing updates');
    }

    return recommendations;
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      renderTime: 0,
      updateTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      parameterUpdateCount: 0,
      averageRenderTime: 0,
      peakMemoryUsage: 0
    };
    this.samples = [];
  }

  // Private methods

  private collectMetrics(): void {
    // Update memory usage
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
      this.metrics.peakMemoryUsage = Math.max(
        this.metrics.peakMemoryUsage,
        this.metrics.memoryUsage
      );
    }

    // Store sample
    this.samples.push({ ...this.metrics });
    
    // Limit sample history
    if (this.samples.length > this.config.maxSamples) {
      this.samples.shift();
    }

    // Check for alerts
    if (this.metrics.memoryUsage > this.config.alertThresholds.memoryUsage) {
      this.notifyAlert('memory', {
        memoryUsage: this.metrics.memoryUsage,
        threshold: this.config.alertThresholds.memoryUsage
      });
    }
  }

  private updateRenderMetrics(renderTime: number): void {
    this.metrics.renderTime = renderTime;
    
    // Calculate rolling average
    const recentSamples = this.samples.slice(-10);
    if (recentSamples.length > 0) {
      const totalRenderTime = recentSamples.reduce((sum, sample) => sum + sample.renderTime, 0);
      this.metrics.averageRenderTime = totalRenderTime / recentSamples.length;
    } else {
      this.metrics.averageRenderTime = renderTime;
    }
  }

  private updateUpdateMetrics(updateTime: number): void {
    this.metrics.updateTime = updateTime;
  }

  private notifyAlert(type: string, data: any): void {
    this.observers.forEach(observer => {
      try {
        observer(type, data);
      } catch (error) {
        console.error('Performance alert observer error:', error);
      }
    });
  }
}

/**
 * Performance optimization utilities
 */
export class PerformanceOptimizer {
  private static debounceTimers = new Map<string, NodeJS.Timeout>();
  private static throttleTimers = new Map<string, number>();

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        fn(...args);
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const lastCall = this.throttleTimers.get(key) || 0;
      const now = Date.now();

      if (now - lastCall >= delay) {
        fn(...args);
        this.throttleTimers.set(key, now);
      }
    };
  }

  /**
   * Batch multiple operations
   */
  static batch<T>(operations: (() => T)[]): T[] {
    const results: T[] = [];
    
    // Use requestAnimationFrame for batching
    return new Promise<T[]>((resolve) => {
      requestAnimationFrame(() => {
        operations.forEach(op => {
          results.push(op());
        });
        resolve(results);
      });
    }) as any;
  }

  /**
   * Memoize expensive calculations
   */
  static memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyFn?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyFn ? keyFn(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }

      const result = fn(...args);
      cache.set(key, result);
      
      // Limit cache size
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    }) as T;
  }

  /**
   * Optimize animation frame usage
   */
  static requestOptimizedFrame(callback: () => void): number {
    // Use requestIdleCallback if available, fallback to requestAnimationFrame
    if ('requestIdleCallback' in window) {
      return (window as any).requestIdleCallback(callback, { timeout: 16 });
    } else {
      return requestAnimationFrame(callback);
    }
  }

  /**
   * Check if device has reduced motion preference
   */
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Get device performance tier
   */
  static getPerformanceTier(): 'low' | 'medium' | 'high' {
    // Simple heuristic based on hardware concurrency and memory
    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory || 1;

    if (cores >= 8 && memory >= 8) {
      return 'high';
    } else if (cores >= 4 && memory >= 4) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}
