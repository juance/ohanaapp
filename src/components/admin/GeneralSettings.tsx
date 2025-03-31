
import React from 'react';
import { GeneralSettingsCard } from './settings/GeneralSettingsCard';
import { GeneralSettingsProvider } from './settings/GeneralSettingsContext';

export function GeneralSettings() {
  return (
    <GeneralSettingsProvider>
      <GeneralSettingsCard />
    </GeneralSettingsProvider>
  );
}
