import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0', // Expose to network
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      host: process.env.VITE_HMR_HOST || 'localhost',
      port: parseInt(process.env.VITE_HMR_PORT || '5173'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('sonner') || id.includes('zod')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
          
          if (id.includes('/dashboard/pages/')) {
            if (id.includes('Simulasi')) {
              return 'feature-simulasi';
            }
            if (id.includes('Portfolio') || id.includes('AutoCV') || id.includes('Profile')) {
              return 'feature-portfolio';
            }
            return 'feature-dashboard';
          }
          
          if (id.includes('/company/pages/')) {
            return 'feature-company';
          }
          
          if (id.includes('/dashboard/components/') || id.includes('/company/components/')) {
            return 'shared-components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
  },
});
