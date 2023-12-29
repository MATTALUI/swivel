import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 6969,
  },
  build: {
    minify: false, // Enable to make Tauri debugging easier
  },
});
