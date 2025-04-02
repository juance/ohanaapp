
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { GeneralSettingsFormValues } from './types';

// Storage key para los ajustes generales
const SETTINGS_STORAGE_KEY = 'laundry_general_settings';

export function GeneralSettingsCard() {
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

  // Aplicar modo oscuro si está habilitado
  useEffect(() => {
    const savedSettings = getSavedSettings();
    if (savedSettings.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const saveSettings = (data: GeneralSettingsFormValues) => {
    try {
      // Guardar en localStorage
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
      
      // Aplicar modo oscuro inmediatamente
      if (data.enableDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      throw error;
    }
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
        <GeneralSettingsForm 
          defaultValues={getSavedSettings()} 
          onSave={saveSettings} 
        />
      </CardContent>
    </Card>
  );
}
