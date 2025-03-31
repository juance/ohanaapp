
type CacheOptions = {
  expireAfter?: number; // milliseconds until cache expiry
};

interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * A simple cache utility for storing and retrieving data with expiration
 */
export const dataCache = {
  // Internal cache storage
  _cache: new Map<string, CachedData<any>>(),
  
  /**
   * Store data in the cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const timestamp = Date.now();
    this._cache.set(key, { data, timestamp });
    
    // Set expiry timeout if specified
    if (options.expireAfter) {
      setTimeout(() => {
        this.invalidate(key);
      }, options.expireAfter);
    }
  },
  
  /**
   * Get data from the cache
   */
  get<T>(key: string, maxAge?: number): T | null {
    const cached = this._cache.get(key);
    
    if (!cached) return null;
    
    // Check if cache is expired based on maxAge
    if (maxAge && Date.now() - cached.timestamp > maxAge) {
      this.invalidate(key);
      return null;
    }
    
    return cached.data as T;
  },
  
  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string, maxAge?: number): boolean {
    const cached = this._cache.get(key);
    if (!cached) return false;
    
    if (maxAge && Date.now() - cached.timestamp > maxAge) {
      this.invalidate(key);
      return false;
    }
    
    return true;
  },
  
  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string): void {
    this._cache.delete(key);
  },
  
  /**
   * Clear all cached data
   */
  clear(): void {
    this._cache.clear();
  }
};

/**
 * Create a key for caching, based on a prefix and optional params
 */
export function createCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params) return prefix;
  return `${prefix}:${JSON.stringify(params)}`;
}
