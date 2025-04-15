
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { SystemError, GenericStringError } from '@/lib/types';

const ERROR_STORAGE_KEY = 'ohana_error_logs';

// Store error to both local storage and push to Supabase if possible
export const logError = async (error: Error, component?: string, additionalContext: Record<string, any> = {}): Promise<string> => {
  try {
    const errorId = uuidv4();
    const timestamp = new Date();
    
    // Create error object
    const errorObj: SystemError = {
      id: errorId,
      message: error.message,
      stack: error.stack || '',
      timestamp,
      context: additionalContext,
      resolved: false,
      component: component || 'unknown'
    };
    
    // Try to store to Supabase
    await supabase
      .from('error_logs')
      .insert({
        id: errorObj.id,
        error_message: errorObj.message,
        error_stack: errorObj.stack,
        error_context: errorObj.context as Record<string, any>,
        component: errorObj.component,
        resolved: errorObj.resolved,
        browser_info: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        }
      });
    
    // Also store locally
    storeErrorLocally(errorObj);
    
    return errorId;
  } catch (storeError) {
    console.error('Error storing error:', storeError);
    return '';
  }
};

// Get all errors from local storage
export const getErrors = (): SystemError[] => {
  try {
    const storedErrors = localStorage.getItem(ERROR_STORAGE_KEY);
    return storedErrors ? JSON.parse(storedErrors) : [];
  } catch (error) {
    console.error('Error getting errors from storage:', error);
    return [];
  }
};

// Store error to local storage
const storeErrorLocally = (error: SystemError): void => {
  try {
    const currentErrors = getErrors();
    currentErrors.push(error);
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(currentErrors));
  } catch (storageError) {
    console.error('Error storing error locally:', storageError);
  }
};

// Clear all errors
export const clearErrors = (): void => {
  localStorage.removeItem(ERROR_STORAGE_KEY);
};

// Mark an error as resolved
export const resolveError = async (errorId: string): Promise<boolean> => {
  try {
    const errors = getErrors();
    const errorIndex = errors.findIndex(e => e.id === errorId);
    
    if (errorIndex !== -1) {
      errors[errorIndex].resolved = true;
      localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(errors));
      
      // Update in Supabase
      await supabase
        .from('error_logs')
        .update({ resolved: true })
        .eq('id', errorId);
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error resolving error:', error);
    return false;
  }
};

// Delete an error
export const deleteError = async (errorId: string): Promise<boolean> => {
  try {
    const errors = getErrors();
    const filteredErrors = errors.filter(e => e.id !== errorId);
    
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(filteredErrors));
    
    // Delete from Supabase
    await supabase
      .from('error_logs')
      .delete()
      .eq('id', errorId);
    
    return true;
  } catch (error) {
    console.error('Error deleting error:', error);
    return false;
  }
};

// Clear resolved errors
export const clearResolvedErrors = async (): Promise<boolean> => {
  try {
    const errors = getErrors();
    const unresolvedErrors = errors.filter(e => !e.resolved);
    
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(unresolvedErrors));
    
    // Delete resolved errors from Supabase
    await supabase
      .from('error_logs')
      .delete()
      .eq('resolved', true);
    
    return true;
  } catch (error) {
    console.error('Error clearing resolved errors:', error);
    return false;
  }
};

// Add setup and init functions for main.tsx
export const setupGlobalErrorHandling = (): void => {
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), 'window.onerror');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    logError(error, 'unhandledrejection');
  });
};

export const initErrorService = (): void => {
  console.log('Error service initialized');
};
