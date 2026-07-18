# Implementation Plan: Express Backend Restructure

## Overview

Restructure the Samuel Milko portfolio from a single-folder Vite SPA (direct Supabase from browser) to a `client/` + `server/` architecture. The Express.js backend handles all Supabase data access using the service-role key. The React frontend communicates with the Express API only (not Supabase for data). Cloudinary handles media uploads; YouTube URLs are rendered as iframe embeds. The white/blank page bug caused by unhandled env-var errors is fixed first.

## Tasks

- [x] 1. Fix the white/blank page display bug
  - Add a `try/catch` around the `supabase.ts` module-level env-var guard so it never throws an unhandled exception during import
  - Create a `client/src/lib/initError.ts` module that exports a `initError: string | null` value set from the caught error message
  - In `client/src/App.tsx` (or `src/App.tsx` before restructure), check `initError` at the top of `MainApp` — if non-null, render a visible `<div>Configuration error: {initError}</div>` instead of a white page
  - Create `client/.env.example` and `server/.env.example` with placeholder values per Requirements 1.4 and 1.5
  - _Requirements: 1.1–1.5_

- [x] 2. Scaffold the client/server folder structure
  - Create the `client/` directory and move all current frontend files into it: `src/`, `index.html`, `vite.config.ts`, `tsconfig.json`, `public/` (if any)
  - Create the `server/` directory with `src/index.ts`, `src/supabase.ts`, `tsconfig.json`, `package.json`
  - Create the root `package.json` with `dev`, `dev:client`, `dev:server`, `build` scripts using `concurrently` and `--prefix`
  - Install `concurrently` in root devDependencies
  - Update all relative import paths inside `client/src/` that broke due to the folder move (e.g., `../lib/supabase` paths remain correct relative to their location)
  - _Requirements: 2.1–2.6_

- [x] 3. Create the Express server entry point and Supabase service-role client
  - Write `server/src/supabase.ts` — initialise the Supabase admin client using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; if either is missing, log the variable name and `process.exit(1)`
  - Write `server/src/index.ts` — create the Express app, apply `cors` (from `CLIENT_URL` env var), `express.json()`, mount all route files under `/api`, and start listening on `PORT`
  - Add `server/.env.example` with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT=3001`, `CLIENT_URL=http://localhost:5173`
  - Install server dependencies: `express`, `cors`, `dotenv`, `@supabase/supabase-js` (pinned), `@types/express`, `@types/cors`, `typescript`, `tsx` in server `package.json`
  - _Requirements: 3.1–3.4_

- [x] 4. Implement all public GET routes and the contact POST route
  - Create `server/src/routes/public.ts` with all ten GET endpoints:
    `GET /api/settings`, `GET /api/categories`, `GET /api/projects`, `GET /api/projects/:id/images`, `GET /api/services`, `GET /api/skills`, `GET /api/experiences`, `GET /api/social-links`, `GET /api/process-steps`, `GET /api/philosophy-items`
  - Create `server/src/routes/messages.ts` with `POST /api/messages` (public, validates `name`, `email`, `message` non-empty, inserts into Supabase)
  - Each route returns HTTP 200 with the data array, HTTP 500 with `{ error }` on failure
  - Mount both route files in `server/src/index.ts`
  - _Requirements: 3.5, 3.6, 3.8, 3.9_

- [x] 5. Implement the auth middleware and all admin-protected routes
  - Create `server/src/middleware/requireAuth.ts` — extracts Bearer token from `Authorization` header, calls `supabase.auth.getUser(token)`, returns HTTP 401 on failure, calls `next()` on success
  - Create `server/src/routes/admin.ts` with all admin CRUD endpoints:
    `PUT /api/settings`; full CRUD for categories, projects, project-images, services, skills, experiences, messages (GET+PUT+DELETE), social-links, process-steps, philosophy-items
  - Apply `requireAuth` middleware to every route in `admin.ts`
  - Mount `admin.ts` in `server/src/index.ts`
  - _Requirements: 3.7, 4.1–4.3_

- [x] 6. Create the frontend API client at `client/src/lib/api.ts`
  - Write `client/src/lib/api.ts` exporting typed functions with the same names and signatures as the current `supabase.ts` data functions: `getSettings`, `getCategories`, `getProjects`, `getProjectImages`, `getAllProjectImages`, `getServices`, `getSkills`, `getExperiences`, `getSocialLinks`, `getProcessSteps`, `getPhilosophyItems`, `createMessage`, plus all admin write functions
  - Each function fetches from the corresponding Express API endpoint (e.g., `getProjects` → `GET /api/projects`)
  - Admin write functions obtain the auth token via `supabase.auth.getSession()` and include `Authorization: Bearer <token>` in headers
  - Define a base URL constant: in development Vite proxies `/api/*` to the Express server; in production it uses `window.location.origin`
  - _Requirements: 5.1–5.3_

- [x] 7. Reduce `client/src/lib/supabase.ts` to auth-only and update all imports
  - Remove all data access functions from `client/src/lib/supabase.ts` — keep only the Supabase anon client initialisation and export
  - Remove the Cloudinary env-var check from `client/src/lib/supabase.ts` (it belongs in the Cloudinary widget caller, not here)
  - Update `client/src/context/DataContext.tsx` to import data functions from `../lib/api` instead of `../lib/supabase`
  - Update `client/src/components/AdminDashboard.tsx` to import write functions from `../lib/api` instead of `../lib/supabase` (keep `supabase` import for auth calls only)
  - Update `client/src/components/ContactForm.tsx` to call `createMessage` from `../lib/api`
  - Run `grep -r "from.*lib/supabase" client/src/` and confirm only `AdminDashboard.tsx` and `DataContext.tsx` import it (for auth), with data functions gone
  - _Requirements: 5.4–5.6_

- [x] 8. Configure Vite proxy and update client build config
  - Update `client/vite.config.ts` to add a `server.proxy` block: `'/api': { target: 'http://localhost:3001', changeOrigin: true }`
  - Confirm `client/package.json` `dev` script is `"vite"` and `build` script is `"vite build"`
  - Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` to `client/.env.example`
  - Update `.gitignore` at the repository root to include `client/.env`, `client/.env.local`, `server/.env`, `server/.env.local`
  - _Requirements: 2.5, 9.1–9.4, 10.3_

- [x] 9. Implement YouTube embed helper and wire it into ProjectModal
  - Create `client/src/lib/youtube.ts` exporting `toYouTubeEmbedUrl(url: string): string | null` — converts watch URLs (`?v=ID`) and short URLs (`youtu.be/ID`) to `https://www.youtube.com/embed/ID`; returns `null` for non-YouTube or empty input
  - In `client/src/components/ProjectModal.tsx`, import `toYouTubeEmbedUrl` and render a responsive `<iframe>` with `allowFullScreen`, full `allow` attribute, and `title` when `toYouTubeEmbedUrl(project.video_url)` returns non-null
  - If `video_url` is null/empty or `toYouTubeEmbedUrl` returns null, render nothing
  - _Requirements: 7.1–7.5_

- [ ] 10. Final integration checkpoint — compile, proxy, and build verification
  - Run `tsc --noEmit` in both `client/` and `server/` and confirm zero TypeScript errors
  - Start the Express server with `npm run dev:server` and confirm it logs "Listening on port 3001"
  - Start the Vite dev server with `npm run dev:client` and confirm the app renders without a white page (data loads from the Express API via proxy)
  - Run `npm run build` (client build) and confirm zero errors
  - Run `grep -r "service_role" client/dist/` and confirm zero matches
  - Confirm no import of data functions from `../lib/supabase` remains in any client component (only auth imports allowed)
  - _Requirements: 1.1–1.3, 9.3, 9.5_

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4", "5"] },
    { "id": 4, "tasks": ["6"] },
    { "id": 5, "tasks": ["7", "8", "9"] },
    { "id": 6, "tasks": ["10"] }
  ]
}
```

## Notes

- Task 1 is the highest priority — it fixes the live white page bug without requiring any folder restructure
- Tasks 2–10 are the full restructure; they build on each other sequentially
- The Supabase database schema (`supabase/migrations/`) and RLS policies remain unchanged — only the access pattern changes (Express uses service-role, bypassing RLS for data; frontend uses anon key for auth only)
- The Admin user is created via the Supabase Auth dashboard — not a coding task
- After task 2, ensure all `import` paths inside `client/src/` still resolve correctly before continuing
