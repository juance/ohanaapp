
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GeneralSettingsFormValues } from './types';

// Storage key for the general settings
export const SETTINGS_STORAGE_KEY = 'laundry_general_settings';

// Default values to be used if no data is saved
export const defaultSettings: GeneralSettingsFormValues = {
  businessName: 'Lavandería Ohana',
  address: 'Calle Principal #123, Ciudad',
  phone: '555-123-4567',
  email: 'contacto@lavanderiaohana.com',
  welcomeMessage: 'Bienvenido a Lavandería Ohana, donde cuidamos tu ropa como si fuera nuestra.',
  enableNotifications: true,
  enableDarkMode: false,
  language: 'es',
};

interface GeneralSettingsContextType {
  settings: GeneralSettingsFormValues;
  saveSettings: (data: GeneralSettingsFormValues) => void;
  getSavedSettings: () => GeneralSettingsFormValues;
}

const GeneralSettingsContext = createContext<GeneralSettingsContextType>({
  settings: defaultSettings,
  saveSettings: () => {},
  getSavedSettings: () => defaultSettings,
});

export const useGeneralSettings = () => useContext(GeneralSettingsContext);

export const GeneralSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GeneralSettingsFormValues>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = getSavedSettings();
    setSettings(savedSettings);
    
    // Apply dark mode if enabled
    if (savedSettings.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Get saved settings from localStorage
  const getSavedSettings = (): GeneralSettingsFormValues => {
    try {
      const savedData = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  };

  // Save settings to localStorage
  const saveSettings = (data: GeneralSettingsFormValues) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
      setSettings(data);
      
      // Apply dark mode immediately
      if (data.enableDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  return (
    <GeneralSettingsContext.Provider value={{ settings, saveSettings, getSavedSettings }}>
      {children}
    </GeneralSettingsContext.Provider>
  );
};
