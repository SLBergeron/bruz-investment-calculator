import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  // Base path for dual environment support
  base: mode === 'production' ? '/bruz-investment-calculator/' : '/',
  
  server: {
    host: '0.0.0.0',
    port: 5000,
    hmr: {
      clientPort: 5000
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-alert-dialog', '@radix-ui/react-label']
        }
      }
    }
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Define environment variables
  define: {
    __IS_GITHUB_PAGES__: JSON.stringify(mode === 'production')
  }
}))