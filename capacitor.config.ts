import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kalbelqamar.app',
  appName: 'Kalbelqamar',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
