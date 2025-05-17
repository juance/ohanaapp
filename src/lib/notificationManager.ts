
import { toast } from '@/lib/toast';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    // Load persisted notifications from localStorage
    this.loadFromStorage();
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Add a new notification
  addNotification(
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Notification {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      data
    };

    this.notifications.unshift(notification);
    this.persistToStorage();
    this.notifyListeners();
    
    // También mostrar como toast si la aplicación está abierta
    toast[type]({
      title,
      description: message
    });

    return notification;
  }

  // Mark a notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.persistToStorage();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.persistToStorage();
    this.notifyListeners();
  }

  // Delete a notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.persistToStorage();
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.persistToStorage();
    this.notifyListeners();
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Convenience methods
  info(title: string, message: string, data?: any): Notification {
    return this.addNotification(NotificationType.INFO, title, message, data);
  }

  success(title: string, message: string, data?: any): Notification {
    return this.addNotification(NotificationType.SUCCESS, title, message, data);
  }

  warning(title: string, message: string, data?: any): Notification {
    return this.addNotification(NotificationType.WARNING, title, message, data);
  }

  error(title: string, message: string, data?: any): Notification {
    return this.addNotification(NotificationType.ERROR, title, message, data);
  }

  // Private methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private persistToStorage(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to persist notifications', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert string timestamps back to Date objects
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications from storage', error);
    }
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();
