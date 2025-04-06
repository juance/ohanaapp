
// Import toast function and hook directly
import { toast } from '@/hooks/use-toast';

// Re-export the toast function 
export { toast };

// This is a centralized place for toast functionality
// All components should import toast from here instead of directly from sonner
