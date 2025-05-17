
import { useCallback } from 'react';
import { PaymentMethod } from '@/lib/types';

/**
 * Hook for utility functions related to pickup orders
 */
export const usePickupUtils = () => {
  /**
   * Formatea una fecha en formato legible
   */
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch (e) {
      return dateString;
    }
  }, []);

  /**
   * Maps a payment method string to PaymentMethod type
   */
  const mapPaymentMethod = useCallback((method: string | null): PaymentMethod => {
    if (!method) return 'cash';
    
    switch (method) {
      case 'cash': return 'cash';
      case 'debit': return 'debit';
      case 'mercadopago': return 'mercadopago';
      case 'cuenta_dni': return 'cuenta_dni';
      default: return 'cash';
    }
  }, []);

  return {
    formatDate,
    mapPaymentMethod
  };
};
