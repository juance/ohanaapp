
import { State, Toast } from "./types";

// Initial state
export const memoryState: State = { toasts: [] };

// Global state storage
export const listeners: ((state: State) => void)[] = [];

// Reducer actions
type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast>; id: string }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

// Dispatch function
export const dispatch = (action: Action): void => {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState.toasts = [...memoryState.toasts, action.toast];
      break;
    case "UPDATE_TOAST":
      memoryState.toasts = memoryState.toasts.map((t) =>
        t.id === action.id ? { ...t, ...action.toast } : t
      );
      break;
    case "DISMISS_TOAST":
      memoryState.toasts = memoryState.toasts.map((t) =>
        t.id === action.toastId || action.toastId === undefined
          ? { ...t, open: false }
          : t
      );
      break;
    case "REMOVE_TOAST":
      memoryState.toasts = memoryState.toasts.filter(
        (t) => t.id !== action.toastId
      );
      break;
  }

  // Notify all listeners
  listeners.forEach((listener) => listener(memoryState));
};
