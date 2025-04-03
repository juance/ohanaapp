
import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  // Initialize with a safe default based on current window size if available
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false; // Default for SSR
  });

  useEffect(() => {
    // Skip if not in a browser environment
    if (typeof window === 'undefined') return;
    
    // Function to check if is mobile device
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Check immediately in case it wasn't set correctly initially
    checkIsMobile();

    // Add listener for resize events
    window.addEventListener('resize', checkIsMobile);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
