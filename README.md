# Gridslice Pro

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thai2902/gridslice-pro-advanced-image-slicing-tool)

A production-ready full-stack application template built on Cloudflare Workers and Pages. Features a modern React frontend with shadcn/ui components, Tailwind CSS styling, and a Hono-powered API backend. Designed for rapid development, seamless deployment, and scalability on Cloudflare's edge network.

## Features

- **Full-Stack Architecture**: React SPA frontend served as static assets with dynamic API routes handled by Cloudflare Workers.
- **Modern UI**: shadcn/ui component library with Tailwind CSS, dark mode support, and responsive design.
- **Type-Safe API**: Hono routing with TypeScript, automatic CORS, logging, and error handling.
- **State Management**: Tanstack Query for data fetching, caching, and mutations.
- **Developer Experience**: Vite for fast HMR, Bun for package management, ESLint/TypeScript linting.
- **Sidebar Layout**: Collapsible responsive sidebar with search and navigation.
- **Theme System**: Automatic dark/light mode with persistence.
- **Error Handling**: Client-side error reporting to API, React Error Boundaries.
- **Production Optimized**: Code splitting, tree shaking, and edge deployment.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, Tanstack Query, shadcn/ui, Tailwind CSS, Lucide Icons, Sonner (toasts), Framer Motion
- **Backend**: Cloudflare Workers, Hono, TypeScript
- **Styling**: Tailwind CSS, Tailwind Animate, CSS Variables
- **Utilities**: Zod (validation), Immer, Zustand, clsx, tw-merge
- **Dev Tools**: Bun, Wrangler, ESLint, Prettier

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
   - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (`bunx wrangler@latest init` or `npm i -g wrangler`)
   - Cloudflare account and API token with Workers/Pages permissions

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd gridslice-pro-7r1op4fxovrnbnyyop3wc
   bun install
   ```

3. **Development**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:3000` (or `$PORT`).

4. **Build**:
   ```bash
   bun run build
   ```

## Development

- **Frontend**: Edit files in `src/`. Hot Module Replacement (HMR) works out-of-the-box.
- **API Routes**: Add routes in `worker/userRoutes.ts`. Core worker logic in `worker/index.ts` (do not modify).
- **Custom Routes**: Extend `userRoutes(app)` function. Supports all Hono middleware.
- **Environment Variables**: Use `wrangler.toml` or dashboard for production bindings.
- **Type Generation**: `bun run cf-typegen` for Worker types.
- **Linting**: `bun run lint`
- **Preview**: `bun run preview`

### Project Structure

```
├── src/              # React app (pages, components, hooks)
├── worker/           # Cloudflare Worker (API routes)
├── shared/           # (Optional) Shared TypeScript types
├── tailwind.config.js # Theme & animations
└── wrangler.jsonc    # Deployment config
```

## Deployment

Deploy to Cloudflare Workers & Pages with one command:

```bash
bun run deploy
```

This builds the frontend assets and deploys the Worker. Your app will be live at `<your-subdomain>.workers.dev`.

Alternatively, use the [Cloudflare dashboard](https://dash.cloudflare.com/) or Wrangler directly:

```bash
wrangler deploy
```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thai2902/gridslice-pro-advanced-image-slicing-tool)

**Custom Domain**: Set `routes` in `wrangler.jsonc` and add via dashboard.

**Bindings (KV/DO/R2)**: Configure in `wrangler.jsonc` under `env` or dashboard.

## Customization

- **Sidebar**: Edit `src/components/app-sidebar.tsx` or replace `AppLayout`.
- **Homepage**: Update `src/pages/HomePage.tsx`.
- **Theme**: Modify `tailwind.config.js` and `src/index.css`.
- **API Example**: Add to `worker/userRoutes.ts`:
  ```ts
  app.get('/api/users', (c) => c.json({ users: [] }));
  ```
- **shadcn Components**: `bunx shadcn-ui@latest add <component>`

## Troubleshooting

- **Worker Routes Not Loading**: Restart dev server.
- **CORS Issues**: Routes under `/api/*` have built-in CORS.
- **Types**: Run `bun run cf-typegen`.
- **Bun Issues**: Ensure Bun >=1.0, delete `node_modules` and reinstall.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

⭐ Star on GitHub · 👀 [Cloudflare Docs](https://developers.cloudflare.com/workers/) · 💬 Issues welcome!