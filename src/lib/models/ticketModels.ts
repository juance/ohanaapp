
import { PaymentMethod } from '../types';

/**
 * Represents a ticket service (like dry cleaning items)
 */
export interface TicketService {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Represents customer information related to a ticket
 */
export interface TicketCustomer {
  id?: string;
  name: string; 
  phoneNumber: string;
  loyaltyPoints?: number;
  valetsCount?: number;
  freeValets?: number;
}

/**
 * Represents the status of a ticket
 */
export type TicketStatus = 'pending' | 'processing' | 'ready' | 'delivered';

/**
 * Options for filtering tickets
 */
export interface TicketFilterOptions {
  status?: TicketStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
  customerId?: string;
  searchTerm?: string;
}

/**
 * Structure for ticket statistics and metrics
 */
export interface TicketMetrics {
  totalCount: number;
  pendingCount: number;
  readyCount: number;
  deliveredCount: number;
  totalRevenue: number;
  averageValue: number;
  paidCount: number;
  unpaidCount: number;
}
