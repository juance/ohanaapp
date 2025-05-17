export interface NotificationOptions {
  title: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    // Initialize with empty notifications array
    this.notifications = [];
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  addNotification(title: string, message: string, type: NotificationType = NotificationType.INFO): void {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(notification);
    // Keep only the last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications.pop();
    }
    
    this.notifySubscribers();
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notifySubscribers();
  }

  clearAll(): void {
    this.notifications = [];
    this.notifySubscribers();
  }

  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.getNotifications()));
  }

  // Convert from previous method signatures to new ones
  sendNotification(message: { title: string; description: string }): void {
    this.addNotification(message.title, message.description);
  }

  // Actual notification function that expects a proper object
  actualNotificationFunction(messageObj: { title: string; description: string }): void {
    this.addNotification(messageObj.title, messageObj.description);
  }
}

// Export a singleton instance
export const notificationManager = new NotificationManager();

// Show a notification with the given options
export const showNotification = (options: NotificationOptions) => {
  const { title, description, type = 'info', duration = 3000 } = options;
  
  const notificationType = type as unknown as NotificationType;
  notificationManager.addNotification(title, description, notificationType);
};

// Convenience methods for different notification types
export const showSuccess = (title: string, description: string, duration?: number) => {
  showNotification({ title, description, type: 'success', duration });
};

export const showError = (title: string, description: string, duration?: number) => {
  showNotification({ title, description, type: 'error', duration });
};

export const showWarning = (title: string, description: string, duration?: number) => {
  showNotification({ title, description, type: 'warning', duration });
};

export const showInfo = (title: string, description: string, duration?: number) => {
  showNotification({ title, description, type: 'info', duration });
};
