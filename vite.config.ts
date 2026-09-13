import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const mergedEnv = { ...process.env, ...env };
  console.log("VITE ENV KEYS:", Object.keys(mergedEnv).filter(k => k.includes('FIRE') || k.includes('VITE_')));
  return {
    define: {
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(mergedEnv.VITE_FIREBASE_API_KEY || mergedEnv.FIREBASE_API_KEY || ''),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(mergedEnv.VITE_FIREBASE_AUTH_DOMAIN || mergedEnv.FIREBASE_AUTH_DOMAIN || ''),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(mergedEnv.VITE_FIREBASE_PROJECT_ID || mergedEnv.FIREBASE_PROJECT_ID || ''),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(mergedEnv.VITE_FIREBASE_STORAGE_BUCKET || mergedEnv.FIREBASE_STORAGE_BUCKET || ''),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(mergedEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || mergedEnv.FIREBASE_MESSAGING_SENDER_ID || ''),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(mergedEnv.VITE_FIREBASE_APP_ID || mergedEnv.FIREBASE_APP_ID || ''),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'HerShield',
          short_name: 'HerShield',
          theme_color: '#0B1020',
          icons: [
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
          ]
        }
      })
    ]
  };
});
