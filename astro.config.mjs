// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.ts';

export default defineConfig({
  site: SITE.url,
  integrations: [sitemap({ filter: (page) => !page.includes('/search/') })],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
