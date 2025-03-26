
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { saveToLocalStorage, getFromLocalStorage } from '@/lib/data/coreUtils';

// Storage key para los ajustes generales
const SETTINGS_STORAGE_KEY = 'laundry_general_settings';

interface GeneralSettingsFormValues {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  welcomeMessage: string;
  enableNotifications: boolean;
  enableDarkMode: boolean;
  language: string;
}

export function GeneralSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Valores predeterminados que se usarán si no hay datos guardados
  const defaultValues: GeneralSettingsFormValues = {
    businessName: 'Lavandería Ohana',
    address: 'Calle Principal #123, Ciudad',
    phone: '555-123-4567',
    email: 'contacto@lavanderiaohana.com',
    welcomeMessage: 'Bienvenido a Lavandería Ohana, donde cuidamos tu ropa como si fuera nuestra.',
    enableNotifications: true,
    enableDarkMode: false,
    language: 'es',
  };

  // Cargar configuración desde localStorage al iniciar
  const getSavedSettings = (): GeneralSettingsFormValues => {
    const savedData = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : defaultValues;
  };

  const form = useForm<GeneralSettingsFormValues>({
    defaultValues: getSavedSettings(),
  });

  // Aplicar modo oscuro si está habilitado
  useEffect(() => {
    const savedSettings = getSavedSettings();
    if (savedSettings.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Escuchar cambios en el modo oscuro
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'enableDarkMode') {
        if (value.enableDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: GeneralSettingsFormValues) => {
    setIsSaving(true);
    
    try {
      // Guardar en localStorage
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
      
      // Aplicar modo oscuro inmediatamente
      if (data.enableDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Mostrar notificación de éxito
      toast({
        title: "Configuración guardada",
        description: "Los ajustes generales se han actualizado correctamente.",
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los ajustes. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    form.reset(defaultValues);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultValues));
    
    // Actualizar modo oscuro según valores predeterminados
    if (defaultValues.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: "Formulario restablecido",
      description: "Se han restaurado los valores predeterminados.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ajustes Generales</CardTitle>
            <CardDescription>Configuración básica del sistema</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50">v1.0.0</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Negocio</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la empresa" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección física" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de teléfono" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje de Bienvenida</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mensaje que se mostrará en la página principal" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Este mensaje aparecerá en la página de inicio para dar la bienvenida a los usuarios.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="enableNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>Notificaciones</FormLabel>
                      <FormDescription>
                        Activar alertas del sistema
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableDarkMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>Modo Oscuro</FormLabel>
                      <FormDescription>
                        Interfaz con tema oscuro
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <FormLabel>Idioma</FormLabel>
                      <FormDescription>
                        Español
                      </FormDescription>
                    </div>
                    <div className="flex items-center">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <Badge>Predeterminado</Badge>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Restablecer
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
