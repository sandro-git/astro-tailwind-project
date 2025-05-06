// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import db from '@astrojs/db';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'server', // Active le mode rendu côté serveur
  adapter: node({
    mode: 'standalone' // Mode standalone pour le développement local
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    db()
  ]
});