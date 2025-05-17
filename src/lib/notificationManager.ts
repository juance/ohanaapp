export interface NotificationOptions {
  title: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Update the method that has the incorrect parameter type
export const sendNotification = (message: { title: string; description: string }) => {
  // Convert the object to a string or handle it properly
  const formattedMessage = `${message.title}: ${message.description}`;
  // Then call the actual notification function that expects a string
  actualNotificationFunction(formattedMessage);
};

// Or alternatively, update the method signature to accept an object:
export const actualNotificationFunction = (messageObj: { title: string; description: string }) => {
  // Handle the object directly
  console.log(`Notification: ${messageObj.title} - ${messageObj.description}`);
};

// Show a notification with the given options
export const showNotification = (options: NotificationOptions) => {
  const { title, description, type = 'info', duration = 3000 } = options;
  
  // Here you would integrate with your notification system
  // For example, using a toast library or custom notification component
  console.log(`[${type.toUpperCase()}] ${title}: ${description} (${duration}ms)`);
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
