
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { GeneralSettingsFormValues } from '../types';

interface MessageFieldProps {
  control: Control<GeneralSettingsFormValues>;
}

export function MessageField({ control }: MessageFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}
