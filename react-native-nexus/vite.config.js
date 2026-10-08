import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
      'react-native-svg': path.resolve(__dirname, 'src/components/SvgWeb.tsx'),
    },
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(true),
  },
  server: {
    host: true, // доступно с телефона в локальной сети Wi-Fi
    port: 3000,
    open: false,
  },
});
