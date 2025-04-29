
interface CacheItem<T> {
  value: T;
  expiry: number;
}

class CacheService {
  private cache: Record<string, CacheItem<any>> = {};
  
  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache[key];
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (item.expiry < Date.now()) {
      this.remove(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Set a value in cache with expiry in seconds
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache[key] = { value, expiry };
  }

  /**
   * Remove item from cache
   */
  remove(key: string): void {
    delete this.cache[key];
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache = {};
  }

  /**
   * Get a cached value or fetch it if not available
   */
  async getOrFetch<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
    const cachedValue = this.get<T>(key);
    
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    const freshValue = await fetchFn();
    this.set(key, freshValue, ttlSeconds);
    return freshValue;
  }

  /**
   * Invalidate cache by namespace (prefix)
   */
  invalidateNamespace(namespace: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(namespace)) {
        this.remove(key);
      }
    });
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
