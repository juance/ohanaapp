export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  // Corrected toast call without 'duration'
  toast({
    title: type.toUpperCase(),
    description: message,
    variant: type === 'error' ? 'destructive' : 'default',
    // Remove the 'duration' property or use the correct property name if available
  });
};
