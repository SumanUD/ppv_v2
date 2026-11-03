import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://platformplayventure.com',
  compressHTML: true,
  // Old SPA article URLs had no content of their own (audit: duplicates of the
  // homepage). Real 301s live in vercel.json; these are the host-agnostic fallback.
  redirects: {
    '/insights/thinking-layer-marketing': '/insights/',
    '/insights/fractional-cmo-explained': '/insights/',
    '/insights/growth-engine-alignment': '/insights/',
    '/insights/brand-reality-audit-case': '/insights/',
    '/insights/differentiation-interpretation': '/insights/',
    '/insights/perception-before-visibility': '/insights/',
  },
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: 'esbuild'
    }
  }
});
