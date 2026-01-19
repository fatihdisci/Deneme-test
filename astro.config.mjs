import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.discilaw.com',
  base: '/',
  output: 'static', // Astro 5.x: Use static, individual pages opt-out with prerender = false
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), mdx(), sitemap(), markdoc(), keystatic()],
});