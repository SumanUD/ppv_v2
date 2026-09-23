import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://platformplayventure.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: 'esbuild'
    }
  }
});
