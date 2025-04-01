
import * as React from "react";

export type ToastT = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastT & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Create a local state store to manage toasts
type ActionType =
  | {
      type: "ADD_TOAST";
      toast: ToasterToast;
    }
  | {
      type: "UPDATE_TOAST";
      toast: Partial<ToasterToast>;
      toastId: string;
    }
  | {
      type: "DISMISS_TOAST";
      toastId?: string;
    }
  | {
      type: "REMOVE_TOAST";
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const initialState: State = {
  toasts: [],
};

function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
          })),
        };
      }

      // Dismiss a specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST": {
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }
  }
}

// Define a global state and listeners outside of components
let memoryState: State = initialState;
const listeners: Array<(state: State) => void> = [];

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

// Use a non-hook based approach for the toast manager
class ToastManager {
  show(props: ToastOptions) {
    const id = genId();

    const update = (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: props,
        toastId: id,
      });

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        title: props.title,
        description: props.description,
        action: props.action,
      },
    });

    // Also log to console for now
    if (props.variant === "destructive" || props.title === "Error") {
      console.error(`[Toast Error] ${props.title || props.description || id}`);
    } else {
      console.log(`[Toast] ${props.title || props.description || id}`);
    }

    return {
      id: id,
      dismiss,
      update,
    };
  }

  success(message: string, opts: ToastOptions = {}) {
    return this.show({ title: message, variant: "success", ...opts });
  }

  error(message: string, opts: ToastOptions = {}) {
    return this.show({ title: message, variant: "destructive", ...opts });
  }

  warning(message: string, opts: ToastOptions = {}) {
    return this.show({ title: message, variant: "default", ...opts });
  }

  info(message: string, opts: ToastOptions = {}) {
    return this.show({ title: message, variant: "default", ...opts });
  }

  loading(message: string, opts: ToastOptions = {}) {
    return this.show({ title: message, variant: "default", ...opts });
  }

  dismiss(toastId?: string) {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }

  custom(jsx: React.ReactNode, opts: ToastOptions = {}) {
    return this.show({ title: undefined, description: undefined, action: jsx, ...opts });
  }

  async promise<T extends Promise<any>>(
    promise: T,
    msgs: { loading?: string; success: string; error?: string }
  ) {
    const id = this.loading(msgs.loading || "Loading...");
    try {
      const data = await promise;
      this.success(msgs.success);
      return data;
    } catch (error) {
      this.error(msgs.error || "An error occurred");
      throw error;
    } finally {
      this.dismiss(id.id);
    }
  }
}

// Export a singleton instance
export const toast = new ToastManager();

export type ToastFunction = typeof toast;

// Export the useToast hook separately from the toast singleton
export function useToast() {
  // Fix: Use useReducer instead of useState to avoid hook dependency issues
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
