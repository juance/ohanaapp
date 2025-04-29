
/**
 * Simple cache service to reduce database queries
 */

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

type CacheOptions = {
  ttl: number; // Time to live in milliseconds
  namespace?: string;
};

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  
  /**
   * Get data from cache or fetch it using the provided function
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = { ttl: 0 }
  ): Promise<T> {
    const cacheKey = options.namespace ? `${options.namespace}:${key}` : key;
    const ttl = options.ttl || this.defaultTTL;
    const now = Date.now();
    
    // Check if data exists in cache and is not expired
    const cachedItem = this.cache.get(cacheKey);
    if (cachedItem && cachedItem.expiresAt > now) {
      console.log(`[Cache] Hit for key: ${cacheKey}`);
      return cachedItem.data;
    }
    
    // If not in cache or expired, fetch fresh data
    console.log(`[Cache] Miss for key: ${cacheKey}`);
    const data = await fetchFn();
    
    // Store in cache
    this.cache.set(cacheKey, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
    
    return data;
  }
  
  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string, namespace?: string): void {
    const cacheKey = namespace ? `${namespace}:${key}` : key;
    this.cache.delete(cacheKey);
    console.log(`[Cache] Invalidated key: ${cacheKey}`);
  }
  
  /**
   * Invalidate all cache entries in a namespace
   */
  invalidateNamespace(namespace: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${namespace}:`)) {
        this.cache.delete(key);
      }
    }
    console.log(`[Cache] Invalidated namespace: ${namespace}`);
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    console.log(`[Cache] Cleared all cache entries`);
  }
  
  /**
   * Get cache stats for debugging
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
