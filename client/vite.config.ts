import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables from the root directory
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '');

  const backendPort = rootEnv.PORT || '5000';
  const targetHost = `http://localhost:${backendPort}`;

  return {
    plugins: [react()],
    envDir: path.resolve(__dirname, '..'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: targetHost,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: targetHost,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
