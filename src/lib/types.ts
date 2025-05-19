
// Re-export all types from the typed directory structure for backward compatibility
export * from '@/lib/types/index';

// Specifically add the types that seem to be missing from imports
export type { Role, User } from '@/lib/types/auth.types';
export type { ClientVisit } from '@/lib/types/client.types';
export type { Customer } from '@/lib/types/customer.types';
export type { PaymentMethod, LaundryOption, LaundryService, DryCleaningItem, Ticket } from '@/lib/types/ticket.types';
export type { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types/metrics.types';
export type { CustomerFeedback, FeedbackSource } from '@/lib/types/feedback.types';
export type { InventoryItemWithTimestamp, InventoryItemFormState, InventoryItemProps } from '@/lib/types/inventory-ui.types';

// Export the utility function
export { convertCustomerToClientVisit } from '@/lib/types/client.types';
