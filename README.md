# Lifetime Reading Estimate

Estimate how many books you can realistically read for the rest of your life. This MVP is structured for future goals and routes, and ships as a static site via Vite.

## Getting started

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Deploy to GitHub Pages

1. Update the `base` option in `vite.config.ts` to match your repository name (e.g. `/my-repo/`).
2. Build the site: `npm run build`.
3. Publish the generated `dist` folder to the `gh-pages` branch. One simple option is:

   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

   Or enable the included `.github/workflows/deploy.yml` workflow (requires Pages enabled in repo settings) to build on `main` and deploy automatically.
