
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.388b62bf0644452c8ab20c928cc8cb11',
  appName: 'ohanaapp',
  webDir: 'dist',
  server: {
    url: 'https://388b62bf-0644-452c-8ab2-0c928cc8cb11.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Enable inline source for better debugging
  ios: {
    contentInset: 'always',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  }
};

export default config;
