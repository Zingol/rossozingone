// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rossozingone.it',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/legal/'),
      serialize(item) {
        if (item.url === 'https://rossozingone.it/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        } else if (item.url.includes('/servizi/') || item.url.includes('/fractional-manager/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.6;
        }
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});