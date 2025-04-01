
import * as React from "react";
import { ToastOptions, ToasterToast } from "./types";
import { addToRemoveQueue, dispatch, genId } from "./toast-store";

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
