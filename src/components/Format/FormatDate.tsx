
import React from 'react';

interface FormatDateProps {
  date: string;
  format?: 'short' | 'long';
  locale?: string;
}

export const FormatDate: React.FC<FormatDateProps> = ({ 
  date, 
  format = 'short', 
  locale = 'es-AR' 
}) => {
  if (!date) return <span>N/A</span>;
  
  try {
    let options: Intl.DateTimeFormatOptions;
    
    if (format === 'short') {
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
    } else {
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
    }
    
    const formattedDate = new Date(date).toLocaleDateString(locale, options);
    return <span>{formattedDate}</span>;
  } catch (e) {
    console.error('Error formatting date:', e);
    return <span>Fecha inválida</span>;
  }
};
