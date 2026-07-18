# Deployment Guide — Samuel Milko Portfolio

Split hosting: **React frontend on Vercel** (fast CDN) + **Express API on Render** (talks to Supabase).

```
┌──────────────┐         ┌──────────────────┐        ┌──────────┐
│   Vercel     │  /api   │     Render       │        │ Supabase │
│  React app   │────────►│   Express API    │───────►│ DB+Auth  │
│  (static)    │         │ service-role key │        │          │
└──────────────┘         └──────────────────┘        └──────────┘
       │  images: Cloudinary (upload widget + CDN URLs)
       │  videos: YouTube (iframe embeds, just paste a watch URL)
```

- **All data** flows browser → Express → Supabase (service-role key stays on the server).
- **Admin login only** goes browser → Supabase Auth (anon key, safe to expose).
- **Images** are uploaded from the admin dashboard to Cloudinary and served from Cloudinary's CDN.
- **Videos** are YouTube URLs stored per-project and rendered as embeds — nothing to host.

---

## 0. One-time prerequisites

1. **Supabase project** — run `supabase/migrations/20240101000000_initial_schema.sql`, then `supabase/seed.sql` in the SQL Editor. Create the admin user under Authentication → Users.
2. **Cloudinary account** — note your **cloud name**, and create an **unsigned upload preset**: Settings → Upload → Upload presets → Add upload preset → Signing mode: *Unsigned*.
3. Push this repo to GitHub.

## 1. Deploy the API to Render

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** → pick this repo (`render.yaml` is auto-detected).
2. Set the environment variables when prompted:

   | Variable | Value |
   |---|---|
   | `SUPABASE_URL` | Supabase → Settings → API → Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
   | `CLIENT_URL` | `http://localhost:5173` for now — update after step 2 |

3. Deploy. Verify: `https://<your-api>.onrender.com/api/health` → `{"status":"ok"}` and `/api/projects` returns JSON.

## 2. Deploy the frontend to Vercel

1. [vercel.com/new](https://vercel.com/new) → import the repo → set **Root Directory: `client`** (framework auto-detects Vite).
2. Environment variables:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-api>.onrender.com` (no trailing slash) |
   | `VITE_SUPABASE_URL` | same Project URL as the API |
   | `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public |
   | `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | your unsigned preset name |

3. Deploy → note your URL, e.g. `https://milkosamuel.vercel.app`.

## 3. Connect them (CORS)

Back in Render → Environment → set:

```
CLIENT_URL=http://localhost:5173,https://milkosamuel.vercel.app
```

(comma-separated, no trailing slashes). Render redeploys automatically.

## 4. Smoke test

- Open the Vercel URL → portfolio loads with data (no white page)
- Contact form submits successfully
- `/` → admin route → log in → edit something → appears on the public site
- Upload an image via the admin (Cloudinary widget opens, URL fills in)
- Add a YouTube watch URL to a project → embed renders in the project modal

## Local development

```bash
# one-time
cp server/.env.example server/.env   # fill in Supabase values
cp client/.env.example client/.env   # fill in Supabase + Cloudinary; leave VITE_API_URL empty

npm run dev   # starts Express :3001 + Vite :5173 (proxy handles /api)
```

## Gotchas

- **Render free tier sleeps** after 15 min idle — first request takes ~30s to wake. Acceptable for a portfolio; a free [UptimeRobot](https://uptimerobot.com) ping to `/api/health` keeps it warm.
- **`VITE_*` vars are baked at build time** — changing them in Vercel requires a redeploy.
- **CORS errors** in the browser console mean `CLIENT_URL` on Render doesn't exactly match your Vercel origin (protocol + host, no trailing slash).
- Never put `SUPABASE_SERVICE_ROLE_KEY` in any `VITE_*` variable or in `client/` — it belongs to the server only.
