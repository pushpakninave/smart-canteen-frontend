// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      define: {
        global: 'globalThis', // Needed for polyfills to work correctly
      },
    },
  },

  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },

  resolve: {
    alias: {
      // Add fallback for Node.js built-ins
      crypto: 'rollup-plugin-node-polyfills/polyfills/crypto-browserify',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    },
  },
});
