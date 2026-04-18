// @ts-check
import { defineConfig } from 'astro/config';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ez-agent-landingpage';
const isProjectPages = !repoName.endsWith('.github.io');
const base = process.env.GITHUB_ACTIONS === 'true' && isProjectPages
  ? `/${repoName}/`
  : '/';

// https://astro.build/config
export default defineConfig({
  base,
});
