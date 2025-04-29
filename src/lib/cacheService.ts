
interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data: value, expiresAt });
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // If item doesn't exist or has expired
    if (!item || item.expiresAt < Date.now()) {
      if (item) {
        this.cache.delete(key); // Clean up expired item
      }
      return null;
    }
    
    return item.data;
  }

  /**
   * Check if a key exists in the cache and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || item.expiresAt < Date.now()) {
      if (item) {
        this.cache.delete(key); // Clean up expired item
      }
      return false;
    }
    return true;
  }

  /**
   * Delete a specific key from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    // Clean up expired items first
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt < Date.now()) {
        this.cache.delete(key);
      }
    }
    
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
