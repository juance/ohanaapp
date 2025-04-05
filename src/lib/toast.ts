import { toast, useToast } from '@/hooks/use-toast';

// Re-export the toast function and useToast hook
export { toast, useToast };

// This is a centralized place for toast functionality
// All components should import toast and useToast from here instead of directly from sonner
