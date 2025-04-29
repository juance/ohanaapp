
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  notificationManager, 
  Notification, 
  NotificationType 
} from '@/lib/notificationManager';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCheck, AlertCircle, Info, CheckCircle, Bell as BellIcon } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationManager.subscribe(setNotifications);
    
    // Initial load
    setNotifications(notificationManager.getNotifications());
    
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      // Mark all as read when opening
      setTimeout(() => {
        notificationManager.markAllAsRead();
      }, 1000);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INFO:
        return <Info className="h-4 w-4 text-blue-500" />;
      case NotificationType.SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case NotificationType.WARNING:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case NotificationType.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notificaciones</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => notificationManager.clearAll()}
            >
              Borrar todas
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-3 ${notification.read ? '' : 'bg-slate-50'}`}
                >
                  <div className="flex items-start gap-2">
                    {getIcon(notification.type)}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <span className="text-xs text-gray-500">
                          {format(notification.timestamp, 'HH:mm', { locale: es })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col p-6">
              <BellIcon className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No hay notificaciones</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
