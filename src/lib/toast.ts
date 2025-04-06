
// Import toast function and hook directly
import { toast, useToast } from '@/hooks/use-toast';

// Re-export both the toast function and the hook
export { toast, useToast };

// This is a centralized place for toast functionality
// All components should import toast from here instead of directly from sonner
