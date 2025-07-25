import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/fajarma-game',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id, { getModuleInfo }) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          } else {
            const info = getModuleInfo(id);
            if (
              info &&
              !info.meta['vite:asset'] &&
              info.dynamicImporters.length
            ) {
              const splittedId = id.split('/');
              return splittedId[splittedId.length - 2];
            }
          }

          return null;
        },
        chunkFileNames: 'assets/chunk-[name]-[hash].js',
      },
    },
  },
});
