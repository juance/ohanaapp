
import { useState } from 'react';

export const useDateState = () => {
  // Date selection state
  const [date, setDate] = useState<Date>(new Date());
  
  // Reset date state
  const resetDateState = () => {
    setDate(new Date());
  };

  return {
    date,
    setDate,
    resetDateState
  };
};
