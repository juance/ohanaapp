
// Export all types from the various type files

// Auth types
export * from './auth.types';

// Ticket types
export * from './ticket.types';

// Customer types
// Use more specific imports to avoid ambiguity
import { convertCustomerToClientVisit } from './customer.types';
export { 
  convertCustomerToClientVisit,
  // Export everything else from customer.types except the conflicting types
  type Customer,
  type CustomerWithStats
} from './customer.types';

// Client types
export * from './client.types';

// Error types
export * from './error.types';

// Sync types
export * from './sync.types';

// Inventory types
export * from './inventory.types';

// Inventory UI types
export * from './inventory-ui.types';

// Metrics types
export * from './metrics.types';

// Menu types
export * from './menu.types';

// Feedback types
export * from './feedback.types';

// Expense types
export * from './expense.types';

// Laundry types - resolve ambiguity by not re-exporting from here
// export * from './laundry.types';
