
import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  // Initialize with a simple boolean to avoid potential initialization issues
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if is mobile device
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Check immediately to set the initial value
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
