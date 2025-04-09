
import { useState } from 'react';

export const useTabState = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('valet');
  
  // Reset tab state
  const resetTabState = () => {
    setActiveTab('valet');
  };

  return {
    activeTab,
    setActiveTab,
    resetTabState
  };
};
