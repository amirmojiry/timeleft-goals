import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Update `base` to match your repository name so the site works on GitHub Pages.
export default defineConfig({
  base: '/timeleft-goals/',
  plugins: [vue()],
})
