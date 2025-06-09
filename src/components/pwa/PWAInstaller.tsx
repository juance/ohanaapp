
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, Wifi, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstaller: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar si ya está instalado como PWA
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isInStandaloneMode);

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent;
    
    if (/iPhone|iPad/.test(userAgent)) {
      return 'En Safari, toca el botón compartir y selecciona "Añadir a pantalla de inicio"';
    } else if (/Android/.test(userAgent)) {
      return 'En Chrome, abre el menú y selecciona "Añadir a pantalla de inicio"';
    } else {
      return 'En tu navegador, busca la opción "Instalar aplicación" o "Añadir a pantalla de inicio"';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            Aplicación Móvil
            {isInstalled && <Badge variant="secondary">Instalada</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
              {isOnline ? 'Conectado' : 'Sin conexión'}
            </span>
          </div>

          {!isInstalled && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Instala la aplicación en tu dispositivo
                </h3>
                <p className="text-blue-700 text-sm">
                  Obtén acceso rápido y funcionalidad offline instalando nuestra aplicación.
                </p>
              </div>

              {deferredPrompt ? (
                <Button onClick={handleInstallClick} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Instalar Aplicación
                </Button>
              ) : (
                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">Instrucciones de instalación:</p>
                  <p>{getInstallInstructions()}</p>
                </div>
              )}
            </div>
          )}

          {isInstalled && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                ¡Aplicación instalada correctamente!
              </h3>
              <p className="text-green-700 text-sm">
                Puedes acceder a la aplicación desde tu pantalla de inicio, incluso sin conexión a internet.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Funcionalidad Offline</h4>
              <p className="text-sm text-gray-600">
                Consulta tickets y datos de clientes sin conexión
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Acceso Rápido</h4>
              <p className="text-sm text-gray-600">
                Icono en pantalla de inicio para acceso inmediato
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Notificaciones</h4>
              <p className="text-sm text-gray-600">
                Recibe notificaciones push de nuevos tickets
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Rendimiento</h4>
              <p className="text-sm text-gray-600">
                Carga más rápido que la versión web
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstaller;
