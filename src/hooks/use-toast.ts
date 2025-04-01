
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

const listeners: Array<(state: State) => void> = [];

let memoryState: State = initialState;

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

export const toast = {
  /**
   * Display a toast notification
   */
  show: (props: Toast) => {
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
  },
  
  /**
   * Show a success toast notification
   */
  success: (message: string, opts?: any) => toast.show({ title: message, variant: "success", ...opts }),
  
  /**
   * Show an error toast notification
   */
  error: (message: string, opts?: any) => toast.show({ title: message, variant: "destructive", ...opts }),
  
  /**
   * Show a warning toast notification
   */
  warning: (message: string, opts?: any) => toast.show({ title: message, variant: "default", ...opts }),
  
  /**
   * Show an info toast notification
   */
  info: (message: string, opts?: any) => toast.show({ title: message, variant: "default", ...opts }),
  
  /**
   * Show a loading toast notification
   */
  loading: (message: string, opts?: any) => toast.show({ title: message, variant: "default", ...opts }),
  
  /**
   * Dismiss a toast by ID or all toasts
   */
  dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  
  /**
   * Show a custom toast with JSX content
   */
  custom: (jsx: React.ReactNode, opts?: any) => toast.show({ title: undefined, description: undefined, action: jsx, ...opts }),
  
  /**
   * Handle a promise with toast notifications for loading, success, and error states
   */
  promise: async <T extends Promise<any>>(promise: T, msgs: { loading?: string; success: string; error?: string }) => {
    const id = toast.loading(msgs.loading || "Loading...");
    try {
      const data = await promise;
      toast.success(msgs.success);
      return data;
    } catch (error) {
      toast.error(msgs.error || "An error occurred");
      throw error;
    } finally {
      toast.dismiss(id.id);
    }
  }
};

export type ToastFunction = typeof toast;

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
