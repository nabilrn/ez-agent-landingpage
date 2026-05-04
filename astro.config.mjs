// @ts-check
import { defineConfig } from 'astro/config';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ez-agent-landingpage';
const isProjectPages = !repoName.endsWith('.github.io');
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// Use BASE_PATH env var if provided (for custom domains).
// For GH Pages without custom domain, use /${repoName}/
// For custom domains or user pages, use /
const base = process.env.BASE_PATH 
  ? process.env.BASE_PATH 
  : (isGithubActions && isProjectPages && !process.env.GITHUB_PAGES_URL ? `/${repoName}/` : '/');

// https://astro.build/config
export default defineConfig({
  base,
  build: {
    assets: 'assets', // Use 'assets' instead of '_astro' to avoid issues with some servers blocking underscore-prefixed folders
  }
});
