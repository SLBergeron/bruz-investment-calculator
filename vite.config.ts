import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Simple base path for Replit-only deployment
  base: '/',
  
  server: {
    host: true,
    port: Number(process.env.PORT) || 5000,
    allowedHosts: true,
    // Conditional HMR: only use custom settings when REPLIT_DEV_DOMAIN is available
    hmr: process.env.REPLIT_DEV_DOMAIN ? {
      host: process.env.REPLIT_DEV_DOMAIN,
      clientPort: 443,
      protocol: 'wss'
    } : true
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
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
  }
})