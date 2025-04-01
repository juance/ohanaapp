
import * as React from "react";
import { State } from "./types";
import { listeners, memoryState, dispatch } from "./toast-store";
import { toast } from "./toast-manager";

// Export the useToast hook separately from the toast singleton
export function useToast() {
  // Fix: Use useState to manage the state but properly set up the subscription
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState);
    
    // Return a cleanup function to unsubscribe
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
