
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { notificationManager, NotificationType } from '@/lib/notificationManager';

const Settings: React.FC = () => {
  const testNotification = () => {
    notificationManager.addNotification(
      "Test Notification", 
      "This is a test notification", 
      NotificationType.INFO
    );
    toast({
      title: "Notification Sent",
      description: "A test notification was created",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div>
              <button 
                onClick={testNotification}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Notification
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-4">System Settings</h2>
          <p className="text-gray-600">
            System settings will be implemented in future releases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
