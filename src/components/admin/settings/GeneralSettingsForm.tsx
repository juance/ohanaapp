
import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { BusinessInfoFields } from './fields/BusinessInfoFields';
import { MessageField } from './fields/MessageField';
import { ToggleFields } from './fields/ToggleFields';
import { GeneralSettingsFormValues } from './types';

interface GeneralSettingsFormProps {
  defaultValues: GeneralSettingsFormValues;
  onSave: (data: GeneralSettingsFormValues) => void;
}

export function GeneralSettingsForm({ defaultValues, onSave }: GeneralSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<GeneralSettingsFormValues>({
    defaultValues,
  });

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
      onSave(data);
      toast.success("Configuración guardada", "Los ajustes generales se han actualizado correctamente.");
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error("Error al guardar", "No se pudieron guardar los ajustes. Intente nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    form.reset(defaultValues);
    onSave(defaultValues);
    
    if (defaultValues.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.error("Formulario restablecido", "Se han restaurado los valores predeterminados.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BusinessInfoFields control={form.control} />
        <MessageField control={form.control} />
        <ToggleFields control={form.control} />

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
  );
}
