import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Check if we're in development mode
const isDev = import.meta.env?.MODE === 'development' || process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://www.discilaw.com',
  base: '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  // Only include Keystatic in development mode (not in production builds)
  integrations: isDev
    ? [react(), mdx(), sitemap(), markdoc(), keystatic()]
    : [react(), mdx(), sitemap(), markdoc()],
});