
import { useState } from 'react';

export const usePriceState = () => {
  // Total price state
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Reset price state
  const resetPriceState = () => {
    setTotalPrice(0);
  };

  return {
    totalPrice,
    setTotalPrice,
    resetPriceState
  };
};
