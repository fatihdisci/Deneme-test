import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://beta.discilaw.com',
  base: '/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    keystatic()
  ],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone'
  })
});