
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { useGeneralSettings } from './GeneralSettingsContext';

export function GeneralSettingsCard() {
  const { getSavedSettings, saveSettings } = useGeneralSettings();

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
