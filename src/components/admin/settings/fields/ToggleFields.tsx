
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { GeneralSettingsFormValues } from '../types';

interface ToggleFieldsProps {
  control: Control<GeneralSettingsFormValues>;
}

export function ToggleFields({ control }: ToggleFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
  );
}
