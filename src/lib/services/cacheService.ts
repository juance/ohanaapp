
/**
 * Simple cache service for local storage with timestamps
 */

// Type for cache entries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get an item from cache
 * @param key Cache key
 * @returns Cached value or null if not found
 */
const get = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return null;
    
    const cacheEntry: CacheEntry<T> = JSON.parse(item);
    return cacheEntry.data;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

/**
 * Get timestamp for a cached item
 * @param key Cache key
 * @returns Timestamp or 0 if not found
 */
const getTimestamp = (key: string): number => {
  try {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return 0;
    
    const cacheEntry = JSON.parse(item);
    return cacheEntry.timestamp;
  } catch {
    return 0;
  }
};

/**
 * Set an item in cache with current timestamp
 * @param key Cache key
 * @param data Data to cache
 */
const set = <T>(key: string, data: T): void => {
  try {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

/**
 * Remove an item from cache
 * @param key Cache key
 */
const remove = (key: string): void => {
  try {
    localStorage.removeItem(`cache_${key}`);
  } catch (error) {
    console.error('Error removing from cache:', error);
  }
};

/**
 * Check if cache contains an item and it's not expired
 * @param key Cache key
 * @param maxAge Maximum age in milliseconds
 */
const isValid = (key: string, maxAge: number): boolean => {
  const timestamp = getTimestamp(key);
  if (timestamp === 0) return false;
  
  const age = Date.now() - timestamp;
  return age <= maxAge;
};

/**
 * Clear all cached items
 */
const clear = (): void => {
  try {
    // Get all keys from localStorage
    const keys = Object.keys(localStorage);
    
    // Filter cache keys and remove them
    keys
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Export the cache service
export const cacheService = {
  get,
  set,
  remove,
  clear,
  getTimestamp,
  isValid
};
