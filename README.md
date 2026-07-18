# MilkoSamuel — Portfolio Website (client + server)

This repository contains a React (Vite + TypeScript) frontend in `client/` and a Node/TypeScript API in `server/`.

**Quick links:** [client/](client) • [server/](server) • [supabase/](supabase) • [assets/](assets)

## Prerequisites
- Node.js 18+ and npm (or pnpm/yarn)
- A Supabase project if you intend to run server-side features

## Local development
1. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

2. Start client and server in separate terminals:

```bash
# client
cd client && npm run dev

# server
cd server && npm run dev
```

3. Open the client at the URL shown by Vite (usually http://localhost:5173).

## Environment
- Copy any `.env.example` files to `.env.local` and set your secrets locally.
- Never commit `.env` files or secret keys.

## Build for production

```bash
# client
cd client && npm run build

# server
cd server && npm run build
```

## Deployment
- Recommended: Deploy the `client/` to Vercel or Netlify. Deploy the `server/` as a separate service (Vercel Serverless, Render, etc.).
- Connect your GitHub repository to your chosen host and set required environment variables.

See `vercel.json` and `render.yaml` for example deployment configurations in this repo.

## Files to exclude from commits
- `node_modules/`
- any `.env*` files containing secrets
- local build outputs such as `dist/`, `client/dist`, or `build/`

## Cleaning before pushing to GitHub / deploying
- Commit only source files and configuration. Use a `.gitignore` to exclude local files and artifacts.
- Common candidates to remove or ignore before a deployment push: test artifacts (`*.test.*`), local-only config files, large temporary assets, and generated build folders.
- If you want, I can propose and remove safe-to-delete candidates (test files and local artifacts). Ask me to proceed.

---

If you'd like, I can now add a deployment-focused `.gitignore` and list specific files I recommend removing before pushing to GitHub.
