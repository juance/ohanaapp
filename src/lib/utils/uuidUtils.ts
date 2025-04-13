/**
 * Generate a UUID v4 (random)
 * This is a fallback implementation for browsers that don't support crypto.randomUUID()
 */
export function generateUUID(): string {
  // If crypto.randomUUID is available, use it
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
