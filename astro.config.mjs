// @ts-check
import { defineConfig } from 'astro/config';

const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  base,
  build: {
    assets: 'assets', // Use 'assets' instead of '_astro' to avoid issues with some servers blocking underscore-prefixed folders
  }
});
